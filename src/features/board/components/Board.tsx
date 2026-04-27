"use client";

import { DndContext } from "@dnd-kit/core";
import { RotateCcw } from "lucide-react";

import { STAGES } from "../constants/stages";
import { useBoard } from "../hooks/useBoard";
import { Providers } from "../lib/providers";
import { Snackbar } from "@/src/components/ui/Snackbar";
import { CandidateDrawer } from "./CandidateDrawer";
import { Column } from "./Column";
import { FilterBar } from "./FilterBar";

function BoardComponent() {
  const {
    handleDragEnd,
    selectedCandidate,
    isSidebarOpen,
    closeSidebar,
    canUndo,
    undoLastMove,
    errorMessage,
    clearError,
  } = useBoard();

  return (
    <main className="w-full px-4 py-4 md:px-6">
      <div className="w-full">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              Recruitment Pipeline
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Drag and drop candidates between stages
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undoLastMove}
              disabled={!canUndo}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Undo
            </button>
          </div>
        </header>

        <FilterBar />

        <Snackbar
          open={Boolean(errorMessage)}
          message={errorMessage ?? ""}
          onClose={clearError}
          variant="error"
          autoHideDurationMs={4500}
        />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="rounded-2xl border border-zinc-200 bg-white/60 p-3 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {STAGES.map((stage) => (
              <Column key={stage} stage={stage} />
            ))}
          </div>
        </div>
      </DndContext>


        <CandidateDrawer
        candidate={selectedCandidate}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      </div>
    </main>
  );
}

export default function Board() {
  return (
    <Providers>
      <BoardComponent />
    </Providers>
  );
}
