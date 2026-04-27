import { useDraggable } from "@dnd-kit/core";
import { useRef } from "react";
import { Briefcase, MapPin } from "lucide-react";

import { useBoardDispatch } from "../lib/hooks";
import { openCandidateSidebar } from "../store/sidebarSlice";
import type { Candidate } from "../store/types";

interface CandidateCardProps {
  candidate: Candidate;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const dispatch = useBoardDispatch();
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
    data: {
      candidateId: candidate.id,
      stage: candidate.stage,
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`cursor-grab select-none rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing ${
        isDragging ? "opacity-80 shadow-md ring-2 ring-indigo-200" : ""
      } touch-none`}
      onPointerDownCapture={(event) => {
        pointerDownRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUpCapture={(event) => {
        const startPoint = pointerDownRef.current;
        pointerDownRef.current = null;
        if (!startPoint) {
          return;
        }

        const movedX = Math.abs(event.clientX - startPoint.x);
        const movedY = Math.abs(event.clientY - startPoint.y);
        const clickTolerance = 4;

        if (movedX <= clickTolerance && movedY <= clickTolerance) {
          dispatch(openCandidateSidebar(candidate.id));
        }
      }}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-xs font-semibold text-white">
            {initials(candidate.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-zinc-900">
              {candidate.name}
            </h3>
            <p className="truncate text-xs text-zinc-600">{candidate.role}</p>
          </div>
        </div>

        <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-emerald-50 px-2 text-xs font-semibold text-emerald-700">
          {candidate.score}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {candidate.experience} yrs exp
        </span>
        {candidate.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {candidate.location}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}
