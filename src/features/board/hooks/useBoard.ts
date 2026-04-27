"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useBoardDispatch, useBoardSelector } from "../lib/hooks";
import { moveCandidate, undoMove } from "../store/boardSlice";
import { closeCandidateSidebar } from "../store/sidebarSlice";
import {
  selectIsSidebarOpen,
  selectSelectedCandidate,
} from "../store/selectors";
import type { Stage } from "../store/types";

const simulateMoveApi = () =>
  new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      const shouldFail = Math.random() < 0.2;
      if (shouldFail) {
        reject(new Error("Failed to update candidate stage. Move reverted."));
        return;
      }

      resolve();
    }, 300);
  });

export function useCandidateMover() {
  const dispatch = useBoardDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingMoveRef = useRef(false);

  return {
    moveCandidateToStage: useCallback(
      async (candidateId: string, fromStage: Stage, toStage: Stage) => {
        if (
          pendingMoveRef.current ||
          !candidateId ||
          !fromStage ||
          !toStage ||
          fromStage === toStage
        ) {
          return;
        }

        // Avoid re-rendering on every successful move when error is already clear.
        setErrorMessage((prev) => (prev === null ? prev : null));
        pendingMoveRef.current = true;
        dispatch(moveCandidate({ id: candidateId, toStage }));

        try {
          await simulateMoveApi();
        } catch (error) {
          dispatch(undoMove());
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to update candidate stage. Move reverted.",
          );
        } finally {
          pendingMoveRef.current = false;
        }
      },
      [dispatch],
    ),
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}

export function useUndo() {
  const dispatch = useBoardDispatch();
  const canUndo = useBoardSelector((state) => state.board.lastAction !== null);

  const undoLastMove = useCallback(() => {
    if (!canUndo) {
      return;
    }

    dispatch(undoMove());
  }, [canUndo, dispatch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const pressedUndo =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z";

      if (!pressedUndo) {
        return;
      }

      event.preventDefault();
      undoLastMove();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undoLastMove]);

  return { canUndo, undoLastMove };
}

export function useSidebar() {
  const dispatch = useBoardDispatch();
  const selectedCandidate = useBoardSelector(selectSelectedCandidate);
  const isSidebarOpen = useBoardSelector(selectIsSidebarOpen);

  const closeSidebar = () => {
    dispatch(closeCandidateSidebar());
  };

  return { selectedCandidate, isSidebarOpen, closeSidebar };
}

export function useBoard() {
  const mover = useCandidateMover();
  const undo = useUndo();
  const sidebar = useSidebar();

  return {
    ...mover,
    ...undo,
    ...sidebar,
  };
}
