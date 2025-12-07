import Image from "next/image";
import Navbar from "./Navbar";
import Guess from "@/app/quiz/page";

export default function Home() {
  return (
    <div className="bg-black block min-h-screen">
        <Guess />
    </div>
  );
}
