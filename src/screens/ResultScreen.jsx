import React, { useState, useEffect, useCallback } from 'react';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigate, useLocation } from 'react-router-dom';

// Firebase Backend endpoint
const BACKEND_ENDPOINT = 'https://us-central1-st-app-8eb83.cloudfunctions.net/translateImage';

async function callBackendAPI(imageDataUrl, sourceLang, targetLang) {
  const response = await fetch(BACKEND_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl, sourceLang, targetLang })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData?.error || `API Error: ${response.status}`;
    throw new Error(errorMsg);
  }

  return response.json();
}

export default function ResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(false);

  // State from navigation
  const imageData = location.state?.imageData;
  const sourceLang = location.state?.sourceLang || '한국어';
  const targetLang = location.state?.targetLang || '태국어';

  // API & Translation state
  const [loading, setLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [error, setError] = useState(null);

  const performTranslation = useCallback(async () => {
    if (!imageData) return;
    setLoading(true);
    setError(null);
    setTranslationResult(null);
    try {
      const result = await callBackendAPI(imageData, sourceLang, targetLang);
      setTranslationResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [imageData, sourceLang, targetLang]);

  // Auto-trigger translation
  useEffect(() => {
    if (imageData) {
      performTranslation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    performTranslation();
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
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Chae</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* API Key Modal Button Removed */}
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
                <p className="text-white font-label-md text-label-md">이미지를 분석하는 중...</p>
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
                다시 시도
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
                듣기
              </button>
            </div>
          </div>
          
          {/* Comparison Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-base border-b border-outline-variant/20">
              <h3 className="font-label-sm text-label-sm text-outline mb-1 uppercase tracking-wider">원본 텍스트</h3>
              <div className="max-h-24 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-container-high rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-surface-container-high rounded animate-pulse w-1/2"></div>
                  </div>
                ) : (
                  <p className="font-body-md text-body-md text-on-surface italic">
                    {translationResult?.fullOriginal || (error ? '—' : '분석 결과를 기다리는 중...')}
                  </p>
                )}
              </div>
            </div>
            <div className="p-base bg-primary-container/10">
              <h3 className="font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider">번역된 텍스트</h3>
              <div className="max-h-32 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-primary-container/30 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-primary-container/30 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <p className="font-body-md text-body-md text-on-surface">
                    {translationResult?.fullTranslated || (error ? '—' : '분석 결과를 기다리는 중...')}
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
              <span className="font-label-sm text-label-sm text-on-surface-variant">복사</span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-base bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-colors active:scale-95">
              <span className="material-symbols-outlined text-on-surface-variant">share</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">공유</span>
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
              <span className="font-label-sm text-label-sm">{saved ? '저장됨' : '저장'}</span>
            </button>
          </div>
        </section>
      </main>

      {/* API Key Modal Removed */}

      <BottomNavBar />
    </div>
  );
}
