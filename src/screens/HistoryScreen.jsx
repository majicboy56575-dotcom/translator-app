import React, { useState } from 'react';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigate } from 'react-router-dom';

const HISTORY_DATA = [
  {
    id: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-CJTuZPoXa87NIDOPBzG7P0ldzx_z-1f2cehlXFYfC-83kIV5AuIPMrkqrhG7SpzMneMVeIUGjyKUTEEP57J-2hjFrLxCvk77LZrfpjLzAE4rqJvvYNq-pm81I15MZiNR4qgTjlgUzBh7m7sE7FsDP1AzwIqoYMsOwVDUZYR_GOOmPor_OP4orBrL5Ug2GJfa5L2fqqF2ZXY0zrevTjMNbytKFB8cDA2d2feQj2tzySuXT0ecLjILffchSR_Sr5qXXg5xNq6gLR0",
    lang: "Italian → English",
    date: "Oct 24",
    title: "Traditional Carbonara Ingredients",
    preview: "Guanciale, pecorino romano, egg yolks...",
    starred: true
  },
  {
    id: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8z3DPDXnhX1yzrs2T7aYejMU-_fwStj0WuUFpUXnoJ80ZqFG54JXnIqjWbE35TIrSvDFQxP8vk_4hOZftsB20Av87tpDvLtjWfxkcMqDQyyI_TDwYqfPzGCvH3LSjseXov2Njou1kByBEbQwzR2XdVp8lxEmfUf1hBdEZdA2O0wTc590Rrm_SpI4J3FzI_qorkNuy_NXTp1_ggd21RyaY7c7CPclnEJw4GT3574KVMODy6Csu8fMYjz8xFbrvGEIIrgsgDbulLZQ",
    lang: "French → English",
    date: "Oct 23",
    title: "Platform 9 Change Notice",
    preview: "Passengers for Lyon please proceed to...",
    starred: false
  },
  {
    id: 3,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPt9F1xKVA-QouoqNXmB1r8B0cawSdsnj-pOTPo2zYkFESYSt1RkcpahEn92jJdOI1sURpVTxG-AFkAXVDcqYlxSI-6vVZjM8Ji8BS2WIoERQOvoOkQ47rHLtZ3zrQu5mwtkoQXOilm04hxAfpnqDN4GmNQjUZT9P7JsK-1s4jQuQlZLsAqSF3UhT2zjk46GQ_B0NPlNjKfVU7MsDarkT-nX8SkfgvZ7T-Q578aiMn4_rvJsPcdloV7r2OmCgo-JDFPqz7DXSZ0LY",
    lang: "Japanese → English",
    date: "Oct 21",
    title: "Limited Edition Souvenir Label",
    preview: "This product contains authentic green tea...",
    starred: false
  },
  {
    id: 4,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfgEnXDZW6js3yajgD4TxlSCIPs-_QdZjpZBWt-4X07bwxqwbVHDV42RlBA5N-S297ms07h2Yqw0FP9TuRZWiRyhW9rKL4MTqyhimyKN4S9k5JVvas1KP8jKaOH0u1sH8iEL0o8sbiosgc_EaetBfd_r1svoEMn3Ju9vK5Z2zRPcAhCRV8t5ndVebWuGu2nuXTFoNZkD64IQFmaDxqQcdaR_ZBo8GLP-NstVK832MZ58c2gjAeZXSV1XxsdusQglY2QIJjogR0TNs",
    lang: "German → English",
    date: "Oct 20",
    title: "Safety Installation Protocol",
    preview: "Ensure the primary circuit breaker is...",
    starred: false
  },
  {
    id: 5,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClxiYzs3FKbS9TXJ2fK11vW5hasC99UAqyf3C8u6lGuZqUufXQzjThg8PhnstxPvEzRvTG2lMyRi906ta8XAQ4G9E0TzWZypm3e-J58I97RGt2ykvbmiP-f68xf_sVzO0JVUirEtCKSHHy_mDydaLVRwGXVC97vr8lHCMrfCMmV5SsRQdytJBj21VpWpDXhQkOGZGGL7nq5S6LEqhYrzEsHl_hWRpR2y2GlbW1ncHF6JriPQ22Z2pR9pRdj_vGZJ-qFYhx8PwcoU4",
    lang: "Spanish → English",
    date: "Oct 18",
    title: "Modern Art Exhibition Intro",
    preview: "This gallery features local artists from...",
    starred: true
  }
];

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Recent');
  const [history, setHistory] = useState(HISTORY_DATA);

  const toggleStar = (e, id) => {
    e.stopPropagation();
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-margin-mobile h-14">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 transition-transform hover:opacity-80 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">LingoLens</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden active:scale-95 transition-transform ring-2 ring-primary/10">
            <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAROMmFs0wcT2NlUsdg4fZwsmERIuZRgbz6opcsw9RF9a8p-kj1LabVUbihW_H5nqHRxBnOFRMCOUhWEuxZXjVisWlycqroSQO7F3umSJ3bt8jkJW4D_WzGZlVBIz3evf8DmpMBOxyWUVTiYqCaCnQBxo3yUlQejFglQNQVwPNwzMj1kt-foJE9WtJTjCuCC0YcBNHzL9m57NRdUgRc7ThF4WQRA6TGk4gEV-o3DqqkOUkK6n9qt7tmmVgp_2b5jHznmsxqwB92WMc" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-margin-mobile pt-base pb-32">
        {/* Search & Filter Area */}
        <section className="flex flex-col gap-base mb-gutter mt-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">search</span>
            </div>
            <input 
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container border border-outline-variant/30 shadow-[0px_2px_4px_rgba(18,28,42,0.05)] font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              placeholder="Search translations..." 
              type="text" 
            />
          </div>
          <div className="flex gap-base overflow-x-auto pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {['Recent', 'Starred', 'Italian', 'French'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex items-center gap-1 px-5 py-2 rounded-full font-label-md transition-all active:scale-95 whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {filter === 'Starred' && <span className="material-symbols-outlined text-[18px]">star</span>}
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* History List */}
        <section className="flex flex-col gap-base">
          {history.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate('/result')}
              className="bg-surface-container-lowest p-base rounded-xl border border-outline-variant/20 shadow-[0px_2px_4px_rgba(18,28,42,0.05)] flex gap-base items-center active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img alt={`History Entry ${item.id}`} className="w-full h-full object-cover" src={item.img} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-sm text-primary uppercase tracking-wider text-[10px]">{item.lang}</span>
                  <span className="font-label-sm text-outline">{item.date}</span>
                </div>
                <h3 className="font-label-md text-on-surface truncate mb-1">{item.title}</h3>
                <p className="font-body-sm text-on-surface-variant truncate">{item.preview}</p>
              </div>
              <button 
                onClick={(e) => toggleStar(e, item.id)}
                className={`p-2 transition-colors ${item.starred ? 'text-primary' : 'text-outline-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined" style={item.starred ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
              </button>
            </div>
          ))}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
