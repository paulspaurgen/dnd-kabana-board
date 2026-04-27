import { createSelector } from "@reduxjs/toolkit";

import { STAGES } from "../constants/stages";
import type { Candidate, Filters, Stage } from "./types";

interface BoardState {
  candidates: Candidate[];
  filters: Filters;
}

interface RootState {
  board: BoardState;
  sidebar: {
    selectedCandidateId: string | null;
    isOpen: boolean;
  };
}

const selectBoardState = (state: RootState) => state.board;

export const selectCandidates = createSelector(
  [selectBoardState],
  (board) => board.candidates,
);

export const selectFilters = createSelector(
  [selectBoardState],
  (board) => board.filters,
);

export const selectFilteredCandidates = createSelector(
  [selectCandidates, selectFilters],
  (candidates, filters) =>
    candidates.filter((candidate) => {
      const normalizedQuery = (filters.nameQuery ?? "").trim().toLowerCase();
      const matchesName = normalizedQuery
        ? candidate.name.toLowerCase().includes(normalizedQuery)
        : true;
      const matchesRole = filters.role
        ? candidate.role.toLowerCase().includes(filters.role.toLowerCase())
        : true;
      const matchesScoreRange =
        candidate.score >= filters.minScore && candidate.score <= filters.maxScore;

      return matchesName && matchesRole && matchesScoreRange;
    }),
);

export const selectFilteredCandidatesByStage = createSelector(
  [selectFilteredCandidates],
  (candidates) => {
    const groupedCandidates = STAGES.reduce(
      (accumulator, stage) => {
        accumulator[stage] = [];
        return accumulator;
      },
      {} as Record<Stage, Candidate[]>,
    );

    candidates.forEach((candidate) => {
      groupedCandidates[candidate.stage]?.push(candidate);
    });

    return groupedCandidates;
  },
);

export const selectCandidatesByStage = (stage: Stage) =>
  createSelector(
    [selectFilteredCandidatesByStage],
    (candidatesByStage) => candidatesByStage[stage] ?? [],
  );

export const selectSidebarState = (state: RootState) => state.sidebar;

export const selectIsSidebarOpen = createSelector(
  [selectSidebarState],
  (sidebar) => sidebar.isOpen,
);

export const selectSelectedCandidateId = createSelector(
  [selectSidebarState],
  (sidebar) => sidebar.selectedCandidateId,
);

export const selectSelectedCandidate = createSelector(
  [selectCandidates, selectSelectedCandidateId],
  (candidates, selectedCandidateId) =>
    selectedCandidateId
      ? candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null
      : null,
);
