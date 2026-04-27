import { Briefcase, MapPin } from "lucide-react";
import { memo } from "react";
import { useBoardDispatch } from "../lib/hooks";
import { openCandidateSidebar } from "../store/sidebarSlice";
import type { Candidate } from "../store/types";

interface CandidateCardProps {
  candidate: Candidate;
}

const CANDIDATE_DRAG_TYPE = "application/x-kabana-candidate";

export interface CandidateDragPayload {
  candidateId: string;
  fromStage: Candidate["stage"];
}

export function hasCandidateDragPayload(dataTransfer: DataTransfer) {
  return Array.from(dataTransfer.types).includes(CANDIDATE_DRAG_TYPE);
}

export function parseCandidateDragPayload(
  dataTransfer: DataTransfer,
): CandidateDragPayload | null {
  const serializedPayload = dataTransfer.getData(CANDIDATE_DRAG_TYPE);
  if (!serializedPayload) {
    return null;
  }

  try {
    const payload = JSON.parse(serializedPayload) as CandidateDragPayload;
    return payload.candidateId && payload.fromStage ? payload : null;
  } catch {
    return null;
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function scorePillClass(score: number) {
  if (score >= 80) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (score >= 50) {
    return "bg-amber-50 text-amber-800";
  }
  return "bg-red-50 text-red-700";
}

function CandidateCard({ candidate }: CandidateCardProps) {
  const dispatch = useBoardDispatch();

  return (
    <article
      draggable
      className="cursor-grab select-none rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing data-[dragging=true]:opacity-40 data-[dragging=true]:shadow-none"
      onClick={() => dispatch(openCandidateSidebar(candidate.id))}
      onDragStart={(event) => {
        event.currentTarget.dataset.dragging = "true";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", candidate.id);
        event.dataTransfer.setData(
          CANDIDATE_DRAG_TYPE,
          JSON.stringify({
            candidateId: candidate.id,
            fromStage: candidate.stage,
          } satisfies CandidateDragPayload),
        );
      }}
      onDragEnd={(event) => {
        delete event.currentTarget.dataset.dragging;
      }}
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

        <span
          className={`inline-flex h-6 shrink-0 items-center rounded-full px-2 text-xs font-semibold ${scorePillClass(
            candidate.score,
          )}`}
        >
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

export default memo(CandidateCard);