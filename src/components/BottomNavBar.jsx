import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'onboarding', icon: 'translate', label: 'แปล', path: '/' },
    { id: 'camera', icon: 'photo_camera', label: 'กล้อง', path: '/camera', fill: true },
    { id: 'result', icon: 'settings', label: 'ตั้งค่า', path: '/result' }, // Just mapping to result for now
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface shadow-[0px_-2px_4px_rgba(15,23,42,0.05)] h-[72px]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 cursor-pointer ${
              isActive 
                ? 'bg-primary-container text-on-primary-container rounded-full' 
                : 'text-on-surface-variant hover:bg-secondary-container/50'
            }`}
          >
            <span 
              className="material-symbols-outlined mb-1" 
              style={item.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
