import { configureStore } from "@reduxjs/toolkit";

import { mockCandidates } from "@/src/data/mockCandidates";
import { boardReducer } from "../store/boardSlice";
import type { Candidate, Filters } from "../store/types";
import { sidebarReducer } from "../store/sidebarSlice";

interface PersistedBoardState {
  candidates: Candidate[];
}

interface BoardSliceState {
  candidates: Candidate[];
  filters: Filters;
  lastAction: {
    candidateId: Candidate["id"];
    fromStage: Candidate["stage"];
    toStage: Candidate["stage"];
  } | null;
}

const BOARD_FILTER_DEFAULTS: Filters = {
  role: null,
  minScore: 0,
  maxScore: 100,
  nameQuery: "",
};

const isBrowser = typeof window !== "undefined";

const loadState = <T>(key: string): T | undefined => {
  if (!isBrowser) {
    return undefined;
  }

  try {
    const serializedState = window.localStorage.getItem(key);
    if (!serializedState) {
      return undefined;
    }

    return JSON.parse(serializedState) as T;
  } catch {
    return undefined;
  }
};

const saveState = <T>(key: string, state: T): void => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Ignore write failures
  }
};

export const boardStore = () => {
  const persistedBoard = loadState<PersistedBoardState>("board");

  const preloadedBoardState: BoardSliceState = {
    candidates: persistedBoard?.candidates ?? (mockCandidates as Candidate[]),
    filters: BOARD_FILTER_DEFAULTS,
    lastAction: null,
  };

  const store = configureStore({
    reducer: {
      board: boardReducer,
      sidebar: sidebarReducer,
    },
    preloadedState: {
      board: preloadedBoardState,
    },
  });

  let previousCandidates = store.getState().board.candidates;
  let saveTimeoutId: number | null = null;

  store.subscribe(() => {
    const candidates = store.getState().board.candidates;
    if (candidates === previousCandidates) {
      return;
    }

    previousCandidates = candidates;
    if (saveTimeoutId !== null) {
      window.clearTimeout(saveTimeoutId);
    }

    saveTimeoutId = window.setTimeout(() => {
      saveTimeoutId = null;
      saveState("board", { candidates });
    }, 0);
  });

  return store;
};

export type BoardStore = ReturnType<typeof boardStore>;
export type BoardState = ReturnType<BoardStore["getState"]>;
export type BoardDispatch = BoardStore["dispatch"];
