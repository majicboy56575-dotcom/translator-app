const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

admin.initializeApp();

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildTranslationPrompt(sourceLang, targetLang) {
  return `You are an OCR and translation assistant. Analyze this image and:
1. Detect all visible text in the image.
2. Identify the language of the text (it should be ${sourceLang}).
3. Translate all detected text from ${sourceLang} to ${targetLang}.
4. Estimate the approximate position of each text block in the image as percentage values (top, left, width).

Return ONLY a valid JSON object in the following format, with no extra text or markdown:
{
  "detectedLanguage": "detected language name",
  "blocks": [
    {
      "original": "original text",
      "translated": "translated text",
      "position": { "top": 20, "left": 10, "width": 40 }
    }
  ],
  "fullOriginal": "all original text combined",
  "fullTranslated": "all translated text combined"
}

If no text is found in the image, return:
{ "detectedLanguage": "none", "blocks": [], "fullOriginal": "", "fullTranslated": "" }`;
}

exports.translateImage = onRequest({ cors: true, maxInstances: 10 }, async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const { imageDataUrl, sourceLang, targetLang } = req.body;

      if (!imageDataUrl || !sourceLang || !targetLang) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      // Extract base64 data and mime type from data URL
      const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
      if (!match) {
        return res.status(400).send({ error: "Invalid image data format." });
      }
      const mimeType = match[1];
      const base64Data = match[2];

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY environment variable is missing.");
        return res.status(500).send({ error: "Server configuration error" });
      }

      const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: buildTranslationPrompt(sourceLang, targetLang) },
              { inlineData: { mimeType, data: base64Data } }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API Error:", errorData);
        const errorMsg = errorData?.error?.message || `API Error: ${response.status}`;
        return res.status(500).send({ error: errorMsg });
      }

      const data = await response.json();
      const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textContent) {
        return res.status(500).send({ error: "No response from Gemini API" });
      }

      // Parse JSON from response
      const jsonStr = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let parsedResult;
      try {
        parsedResult = JSON.parse(jsonStr);
      } catch (e) {
        return res.status(500).send({ error: "Failed to parse Gemini response as JSON", raw: textContent });
      }

      return res.status(200).send(parsedResult);
    } catch (error) {
      console.error("Error in translateImage:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  });
});
