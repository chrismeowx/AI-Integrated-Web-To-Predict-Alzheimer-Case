import React from 'react'

export default function Navbar() {
  return (
    // <nav className="fixed top-10 left-10 text-white justify-between">
    //     <div className="text-lg font-gray">
    //         <a href="#quiz" className="hover:text-white-100">quiz</a>
    //         <a href="#predict" className="hover:text-white-100">predict</a>
    //     </div>
    // </nav>
    <nav className="fixed text-white top-5 right-10 px-6 py-5 flex justify-between items-center">
      <div className="space-x-10">
        <a href="#quiz" className="hover:text-gray-400">Quiz</a>
        <a href="#guess" className="hover:text-gray-400">Guess with AI</a>
      </div>
    </nav>
  )
}
