import type { Candidate } from "../store/types";
import {
  Briefcase,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  X,
} from "lucide-react";

interface CandidateDrawerProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
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

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export function CandidateDrawer({
  candidate,
  isOpen,
  onClose,
}: CandidateDrawerProps) {
  if (!isOpen || !candidate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <aside
        className="pointer-events-auto absolute right-0 top-0 h-dvh w-full max-w-md border-l border-zinc-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Candidate details"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 text-sm font-semibold text-white">
              {initials(candidate.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-zinc-900">
                {candidate.name}
              </div>
              <div className="truncate text-xs text-zinc-500">{candidate.role}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${scorePillClass(
                candidate.score,
              )}`}
            >
              <Star className="h-3.5 w-3.5" />
              {candidate.score}
            </span>
            {candidate.currentCompany ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700">
                <Briefcase className="h-3.5 w-3.5" />
                {candidate.currentCompany}
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-2 text-sm text-zinc-700">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-zinc-500" />
              <span>{candidate.experience} yrs experience</span>
            </div>
            {candidate.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-500" />
                <span>{candidate.location}</span>
              </div>
            ) : null}
            {candidate.email ? (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-500" />
                <span className="truncate">{candidate.email}</span>
              </div>
            ) : null}
            {candidate.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-500" />
                <span>{candidate.phone}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-zinc-900">Bio</div>
            <p className="mt-1 text-sm leading-6 text-zinc-700">{candidate.bio}</p>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-zinc-900">Skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
