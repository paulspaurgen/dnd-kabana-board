"use client";

import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";

import { useBoardSelector } from "../lib/hooks";
import { selectCandidatesByStage } from "../store/selectors";
import type { Stage } from "../store/types";
import { CandidateCard } from "./CandidateCard";

interface ColumnProps {
  stage: Stage;
}

export function Column({ stage }: ColumnProps) {
  const selectStageCandidates = useMemo(() => selectCandidatesByStage(stage), [stage]);
  const candidates = useBoardSelector(selectStageCandidates);
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
    data: { stage },
  });

  return (
    <section
      ref={setNodeRef}
      className={`rounded-2xl border p-3 transition-colors ${
        isOver ? "border-indigo-300 bg-indigo-50/60" : "border-zinc-200 bg-white"
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-zinc-900">{stage}</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
          {candidates.length}
        </span>
      </header>

      <div className="space-y-2 ">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </section>
  );
}
