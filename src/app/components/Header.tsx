import React from "react";

export default function Header({ userName = "người đẹp" }: { userName?: string }) {
  return (
    <header className="bg-[#7b1222] text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="bg-[#8c2130] border border-white/20 text-white px-3 py-1 rounded-md font-semibold leading-4 text-sm">
            KB
            <br />
            Portal
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <div className="hidden sm:block">Hello, {userName}!</div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md border border-white/20">
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}