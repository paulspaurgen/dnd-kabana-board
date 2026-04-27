import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Candidate, Filters, Stage } from "./types";

interface LastAction {
  candidateId: Candidate["id"];
  fromStage: Stage;
  toStage: Stage;
}

interface BoardState {
  candidates: Candidate[];
  filters: Filters;
  lastAction: LastAction | null;
}

const defaultFilters: Filters = {
  role: null,
  minScore: 0,
  maxScore: 100,
  nameQuery: "",
};

const initialState: BoardState = {
  candidates: [],
  filters: defaultFilters,
  lastAction: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    moveCandidate: (
      state,
      action: PayloadAction<{ id: Candidate["id"]; toStage: Stage }>,
    ) => {
      const { id, toStage } = action.payload;
      const candidate = state.candidates.find((item) => item.id === id);

      if (!candidate || candidate.stage === toStage) {
        return;
      }

      state.lastAction = {
        candidateId: candidate.id,
        fromStage: candidate.stage,
        toStage,
      };

      candidate.stage = toStage;
    },

    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },

    clearFilters: (state) => {
      state.filters = defaultFilters;
    },
    updateCandidates: (state, action: PayloadAction<Candidate[]>) => {
      state.candidates = action.payload;
    },

    undoMove: (state) => {
      if (!state.lastAction) {
        return;
      }

      const candidate = state.candidates.find(
        (item) => item.id === state.lastAction?.candidateId,
      );

      if (!candidate) {
        state.lastAction = null;
        return;
      }

      candidate.stage = state.lastAction.fromStage;
      state.lastAction = null;
    },
  },
});

export const { moveCandidate, setFilters, clearFilters, undoMove } =
  boardSlice.actions;

export const boardReducer = boardSlice.reducer;
