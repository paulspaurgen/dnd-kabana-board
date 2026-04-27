"use client";

import { memo, useMemo } from "react";
import { shallowEqual } from "react-redux";

import { useBoardSelector } from "../lib/hooks";
import { selectCandidatesByStage } from "../store/selectors";
import type { Stage } from "../store/types";
import {
  hasCandidateDragPayload,
  parseCandidateDragPayload,
} from "./CandidateCard";
import CandidateCard from "./CandidateCard";

interface ColumnProps {
  stage: Stage;
  onCandidateDrop: (
    candidateId: string,
    fromStage: Stage,
    toStage: Stage,
  ) => void;
}

function clearDropTarget(element: HTMLElement) {
  delete element.dataset.dragOver;
}

function Column({ stage, onCandidateDrop }: ColumnProps) {
  const selectStageCandidates = useMemo(() => selectCandidatesByStage(stage), [stage]);
  const candidates = useBoardSelector(selectStageCandidates, shallowEqual);

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-3 transition-colors data-[drag-over=true]:border-indigo-300 data-[drag-over=true]:bg-indigo-50/60"
      onDragEnter={(event) => {
        if (!hasCandidateDragPayload(event.dataTransfer)) {
          return;
        }

        event.currentTarget.dataset.dragOver = "true";
      }}
      onDragOver={(event) => {
        if (!hasCandidateDragPayload(event.dataTransfer)) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDragLeave={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          nextTarget instanceof Node &&
          event.currentTarget.contains(nextTarget)
        ) {
          return;
        }

        clearDropTarget(event.currentTarget);
      }}
      onDrop={(event) => {
        clearDropTarget(event.currentTarget);

        if (!hasCandidateDragPayload(event.dataTransfer)) {
          return;
        }

        event.preventDefault();
        const payload = parseCandidateDragPayload(event.dataTransfer);
        if (!payload) {
          return;
        }

        onCandidateDrop(payload.candidateId, payload.fromStage, stage);
      }}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-zinc-900">{stage}</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
          {candidates.length}
        </span>
      </header>

      {candidates.length === 0 ? (
        <div className="grid min-h-24 place-items-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-xs text-zinc-500">
          <div>
            <div className="font-medium text-zinc-600">No candidates</div>
            <div className="mt-1">Drop a card here</div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </section>
  );
}

const MemoColumn = memo(Column);
MemoColumn.displayName = "Column";

export default MemoColumn;