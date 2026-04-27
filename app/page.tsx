"use client";
import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/src/features/board/components/Board"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900">


      <Board />
    </div>
  );
}
