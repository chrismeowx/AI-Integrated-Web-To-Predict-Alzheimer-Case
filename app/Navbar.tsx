"use client";

import React from 'react'
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed text-white top-5 right-10 px-6 py-5 flex justify-between items-center">
      <div className="space-x-10">
        <Link href="/quiz" className="hover:text-gray-400">Quiz</Link>
        <Link href="/guess" className="hover:text-gray-400">Guess with AI</Link>
      </div>
    </nav>
  )
}
