"use client";

import Link from "next/link";

export default function TestNavbar() {
  return (
    <nav className="w-full bg-red-500 text-white p-4 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">TEST NAVBAR - DESKTOP</span>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="px-4 py-2 bg-white text-red-500 rounded">Home</Link>
          <Link href="/forum" className="px-4 py-2 bg-white text-red-500 rounded">Community</Link>
          <Link href="/profile" className="px-4 py-2 bg-white text-red-500 rounded">Profile</Link>
        </div>
      </div>
    </nav>
  );
}
