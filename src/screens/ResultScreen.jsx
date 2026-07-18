import React, { useState, useEffect, useCallback } from 'react';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigate, useLocation } from 'react-router-dom';

// Gemini API configuration
const GEMINI_MODEL = 'gemini-3.5-flash';
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

async function callGeminiAPI(apiKey, imageDataUrl, sourceLang, targetLang) {
  // Extract base64 data and mime type from data URL
  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (!match) throw new Error('Invalid image data format. Please capture a photo or select an image from your gallery.');
  const mimeType = match[1];
  const base64Data = match[2];

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
    const errorMsg = errorData?.error?.message || `API Error: ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) throw new Error('No response from Gemini API');

  // Parse JSON from response (handle potential markdown code blocks)
  const jsonStr = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

export default function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(false);

  // State from navigation
  const imageData = location.state?.imageData;
  const sourceLang = location.state?.sourceLang || 'เกาหลี';
  const targetLang = location.state?.targetLang || 'ไทย';

  // API & Translation state
  const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [error, setError] = useState(null);

  const performTranslation = useCallback(async (key) => {
    if (!imageData || !key) return;
    setLoading(true);
    setError(null);
    setTranslationResult(null);
    try {
      const result = await callGeminiAPI(key, imageData, sourceLang, targetLang);
      setTranslationResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [imageData, sourceLang, targetLang]);

  // Auto-trigger translation if API key is available
  useEffect(() => {
    if (imageData && apiKey) {
      performTranslation(apiKey);
    } else if (imageData && !apiKey) {
      setShowApiKeyModal(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const key = apiKey.trim();
    if (!key) return;
    setShowApiKeyModal(false);
    performTranslation(key);
  };

  const handleRetry = () => {
    if (apiKey) {
      performTranslation(apiKey);
    } else {
      setShowApiKeyModal(true);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    if (translationResult?.fullTranslated) {
      navigator.clipboard?.writeText(translationResult.fullTranslated);
    }
  };

  // Fallback to static image if no captured image
  const displayImage = imageData || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvQ6a3qI2hVJKR7IgsUxjq74PWBAsbh6SyGaiwDHv1B0MJW0uUR6ZNgYHD77DTWJ0iI8oNv0t7rBE1m1IeNf6tR7Tcftw4TNOKSE7qCW1afbMbzYvVK43N2G4kAVFxeziacgMAeroeKoLeMRBDcAfNjQGKsJNP7weHf2TFS-hOzdaTrb2FRzFI2oUbRfKatAMXIKnoFw2tSuSG3pOkSeplv30gQrh7uIVu5nB8JlC4BU4DuEXh6s_Jv62xP1UZ1kPNQFIERKK5gRc';

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="w-full top-0 sticky bg-surface dark:bg-surface-dim shadow-sm flex items-center justify-between px-margin-mobile h-14 z-40">
        <div className="flex items-center gap-base">
          <button 
            onClick={() => navigate(-1)}
            className="active:scale-95 transition-transform hover:opacity-80"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">LingoLens</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center hover:opacity-80 active:scale-95 transition-all"
            title="API Key Settings"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">key</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-gutter">
        {/* Captured Photo with Translation Overlays */}
        <section className="relative w-full aspect-[3/4] overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-surface-container">
            <img 
              alt="Captured document" 
              className="w-full h-full object-cover" 
              src={displayImage} 
            />
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-white font-label-md text-label-md">กำลังวิเคราะห์รูปภาพ...</p>
                <p className="text-white/60 font-label-sm text-label-sm">Gemini 2.0 Flash</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-4 px-8">
              <span className="material-symbols-outlined text-error text-[48px]">error_outline</span>
              <p className="text-white font-body-md text-body-md text-center">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-label-md active:scale-95 transition-all"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Dynamic Translated Text Overlays */}
          {translationResult?.blocks?.map((block, index) => (
            <div
              key={index}
              className="absolute bg-white/85 backdrop-blur-sm p-base rounded-lg shadow-md animate-in fade-in z-10"
              style={{
                top: `${block.position?.top || 0}%`,
                left: `${block.position?.left || 0}%`,
                maxWidth: `${block.position?.width || 50}%`,
                animationDuration: `${700 + index * 300}ms`,
              }}
            >
              <p className="font-label-md text-label-md text-on-surface">{block.translated}</p>
            </div>
          ))}
          
          {/* Floating Overlay Actions */}
          {!loading && !error && (
            <div className="absolute bottom-margin-mobile right-margin-mobile flex flex-col gap-base z-10">
              <button className="bg-surface/90 p-base rounded-full shadow-lg active:scale-90 transition-all">
                <span className="material-symbols-outlined text-primary">zoom_in</span>
              </button>
              <button 
                onClick={handleRetry}
                className="bg-surface/90 p-base rounded-full shadow-lg active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined text-primary">sync</span>
              </button>
            </div>
          )}
        </section>

        {/* Comparison & Details Area */}
        <section className="px-margin-mobile flex flex-col gap-gutter">
          {/* Language Header */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-base bg-surface-container-low px-base py-1 rounded-full hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{sourceLang}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              <span className="font-label-sm text-label-sm text-primary font-bold">{targetLang}</span>
            </button>
            <div className="flex gap-base">
              <button className="flex items-center gap-1 text-primary font-label-md text-label-md hover:opacity-70 active:scale-95 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
                ฟัง
              </button>
            </div>
          </div>
          
          {/* Comparison Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-base border-b border-outline-variant/20">
              <h3 className="font-label-sm text-label-sm text-outline mb-1 uppercase tracking-wider">ข้อความต้นฉบับ</h3>
              <div className="max-h-24 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-container-high rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-surface-container-high rounded animate-pulse w-1/2"></div>
                  </div>
                ) : (
                  <p className="font-body-md text-body-md text-on-surface italic">
                    {translationResult?.fullOriginal || (error ? '—' : 'กำลังรอผลวิเคราะห์...')}
                  </p>
                )}
              </div>
            </div>
            <div className="p-base bg-primary-container/10">
              <h3 className="font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider">ข้อความที่แปล</h3>
              <div className="max-h-32 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-primary-container/30 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-primary-container/30 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <p className="font-body-md text-body-md text-on-surface">
                    {translationResult?.fullTranslated || (error ? '—' : 'กำลังรอผลวิเคราะห์...')}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-base pt-1">
            <button 
              onClick={handleCopy}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-base bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-on-surface-variant">content_copy</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">คัดลอก</span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-base bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95">
              <span className="material-symbols-outlined text-on-surface-variant">share</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">แชร์</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-base bg-primary-container text-on-primary-container rounded-xl hover:opacity-90 transition-opacity active:scale-95"
            >
              <span 
                className="material-symbols-outlined" 
                style={saved ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {saved ? 'check_circle' : 'bookmark'}
              </span>
              <span className="font-label-sm text-label-sm">{saved ? 'บันทึกแล้ว' : 'บันทึก'}</span>
            </button>
          </div>
        </section>
      </main>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm"
            onClick={() => setShowApiKeyModal(false)}
          ></div>
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-surface z-[120] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">key</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">คีย์ API Gemini</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">จำเป็นสำหรับการแปลด้วย AI</p>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              รับคีย์ API ฟรีจาก{' '}
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google AI Studio
              </a>
            </p>
            <form onSubmit={handleApiKeySubmit} className="flex flex-col gap-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="วางคีย์ API ของคุณที่นี่..."
                className="w-full h-12 px-4 rounded-xl bg-surface-container border border-outline-variant font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={!apiKey.trim()}
                className="w-full h-12 bg-primary text-on-primary rounded-full font-label-md text-label-md active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                เริ่มแปล
              </button>
            </form>
          </div>
        </>
      )}

      <BottomNavBar />
    </div>
  );
}
