import React from 'react';

export default function TopAppBar({ title = "LingoLens" }) {
  return (
    <header className="w-full top-0 sticky z-[60] bg-surface/80 backdrop-blur-md shadow-sm flex items-center justify-between px-margin-mobile h-14">
      <div className="flex items-center gap-4">
        <button className="hover:opacity-80 transition-opacity active:scale-95 text-primary">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm text-primary">{title}</h1>
      </div>
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden active:scale-95 border border-outline-variant">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmXROiSN1pW6FXIgzTY2nzAkucqGhwMX6KqX-ZJLu28UUcLW9y_r1e5WZmFocjZZVw44ATbLYheYtZuIX7RJ0CMBkF2z006aei9EntPnwkEPM6e2-LEWXeuM1edYV37F_RdamNoz6q1ZGoUvAsLtIX4JNLLTUybyEX__e1OKXEHWjSp7jC4uF_OvJVqOlksP12f8zAtCo7d5kEDcbr1d9SF4V6Fz77JU6pfnxDXXU3gqvtFYNjsQ_ylG8IQlsvxD4WrQQ1c8qxSHo" 
          />
        </div>
      </div>
    </header>
  );
}
