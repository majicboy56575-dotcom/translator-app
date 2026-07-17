import React, { useState, useRef, useEffect, useCallback } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigate } from 'react-router-dom';

export default function CameraScreen() {
  const AVAILABLE_LANGUAGES = ['한국어', '태국어', '영어', '중국어', '베트남어', '라오스어', '러시아어'];

  const [flashOn, setFlashOn] = useState(false);
  const [flashOverlay, setFlashOverlay] = useState(false);
  const [sourceLang, setSourceLang] = useState('영어');
  const [targetLang, setTargetLang] = useState('한국어');
  const [activeSelector, setActiveSelector] = useState(null); // 'source' | 'target' | null
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
        setCameraError(null);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err.message);
      setCameraError(err.message);
      setCameraReady(false);
    }
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  // Capture frame from video to Base64
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    // If video hasn't started or has no dimensions, return null
    if (!video.videoWidth || !video.videoHeight) return null;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    // Validate the data URL is not empty/blank
    if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) return null;
    return dataUrl;
  };

  const handleShutter = () => {
    const imageData = captureFrame();
    if (!imageData) {
      // Camera not ready or capture failed — open gallery instead
      fileInputRef.current?.click();
      return;
    }

    setFlashOverlay(true);
    setTimeout(() => setFlashOverlay(false), 200);
    // Stop camera before navigating
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setTimeout(() => {
      navigate('/result', { state: { imageData, sourceLang, targetLang } });
    }, 400);
  };

  // Handle file selection from gallery
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const imageData = ev.target.result;
      // Stop camera before navigating
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      navigate('/result', { state: { imageData, sourceLang, targetLang } });
    };
    reader.readAsDataURL(file);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleLanguageSelect = (lang) => {
    if (activeSelector === 'source') {
      if (lang === targetLang) {
        swapLanguages();
      } else {
        setSourceLang(lang);
      }
    } else if (activeSelector === 'target') {
      if (lang === sourceLang) {
        swapLanguages();
      } else {
        setTargetLang(lang);
      }
    }
    setActiveSelector(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopAppBar />
      
      <main className="relative flex-grow flex flex-col items-center justify-center overflow-hidden">
        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />
        {/* Hidden file input for gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Viewfinder Background */}
        <div className="absolute inset-0 z-0">
          {cameraReady ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="hidden" />
              {/* Fallback static image when camera is unavailable */}
              <img 
                alt="Camera View"
                className="w-full h-full object-cover grayscale-[0.2] brightness-90" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjZT1ySyXoOmolAaalFhHTsB1QSNqboMgS2gyAPJNcRvCumIJc-_4_2kO--tEbFpuqY3DkRAhUdw_47S1qWb3Rj271aAHva7b-WN5x64gyvXoscpWxemLLsnKyGjHqK6WAx1_qKzzD_spPO2yWN_yJ93kpCGh9vdDnYG1OzYvb9_XDo_S_chbh4IK0f5Wo96EseTSGGj6WSGxZyShHVo3nioIX-Psg4Dtj9atzq89uNjshd7fQ12j0_0LdlnZN35S559-akgogtIU" 
              />
              {cameraError && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-error-container text-on-error-container px-4 py-2 rounded-full font-label-sm text-label-sm z-30 whitespace-nowrap">
                  Camera unavailable — use gallery instead
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Overlay: Scanning UI Frame */}
        <div className="relative z-10 w-[85%] max-w-sm aspect-[3/4] border-2 border-primary/30 rounded-xl flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
          
          <div className="scan-line absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#db2777] opacity-80"></div>
          
          <div className="absolute top-4 bg-black/40 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-label-sm text-label-sm">
            Align text within frame
          </div>
        </div>

        {/* Language Selector */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center bg-surface/90 backdrop-blur-md shadow-lg rounded-full px-4 py-2 gap-3 border border-outline-variant/30">
          <button 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-all cursor-pointer ${activeSelector === 'source' ? 'bg-primary/20 text-primary' : 'hover:bg-surface-container-high'}`}
            onClick={() => setActiveSelector('source')}
          >
            <span className="font-label-md text-label-md text-on-surface">{sourceLang}</span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
          </button>
          
          <button 
            onClick={swapLanguages}
            className="p-1.5 rounded-full hover:bg-primary-container/20 active:scale-90 transition-all cursor-pointer flex items-center text-primary"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
          </button>
          
          <button 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-all cursor-pointer ${activeSelector === 'target' ? 'bg-primary/20 text-primary' : 'hover:bg-surface-container-high'}`}
            onClick={() => setActiveSelector('target')}
          >
            <span className="font-label-md text-label-md text-on-surface">{targetLang}</span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
          </button>
        </div>

        {/* Bottom Camera Controls Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 pb-12 z-20 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-8">
          <div className="flex items-center justify-around w-full max-w-sm mx-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90 shadow-md"
            >
              <span className="material-symbols-outlined">photo_library</span>
            </button>
            
            <button 
              onClick={handleShutter}
              className="relative w-20 h-20 rounded-full border-[4px] border-white flex items-center justify-center group active:scale-90 transition-all duration-200"
            >
              <div className="w-[88%] h-[88%] bg-white rounded-full transition-all group-hover:scale-95 group-active:bg-primary-container"></div>
            </button>
            
            <button 
              onClick={() => setFlashOn(!flashOn)}
              className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center transition-all active:scale-90 shadow-md ${flashOn ? 'text-white' : 'text-white/50'}`}
            >
              <span className="material-symbols-outlined">{flashOn ? 'flash_on' : 'flash_off'}</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* Visual Flash Layer */}
      {flashOverlay && (
        <div className="fixed inset-0 bg-white z-[100] transition-opacity duration-150 opacity-100 pointer-events-none"></div>
      )}

      {/* Language Selection Modal */}
      {activeSelector && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm" 
            onClick={() => setActiveSelector(null)}
          ></div>
          <div className="fixed bottom-0 left-0 w-full bg-surface z-[120] rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom flex flex-col max-h-[70vh]">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low rounded-t-2xl">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {activeSelector === 'source' ? '번역할 언어 선택' : '도착 언어 선택'}
              </h2>
              <button 
                onClick={() => setActiveSelector(null)}
                className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex flex-col gap-1 pb-safe">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = (activeSelector === 'source' && lang === sourceLang) || (activeSelector === 'target' && lang === targetLang);
                  return (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-low text-on-surface'}`}
                    >
                      <span className={`font-body-lg text-body-lg ${isSelected ? 'font-bold' : ''}`}>{lang}</span>
                      {isSelected && <span className="material-symbols-outlined text-primary">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <BottomNavBar />
    </div>
  );
}
