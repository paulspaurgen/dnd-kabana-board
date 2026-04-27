"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useBoardDispatch, useBoardSelector } from "../lib/hooks";
import { moveCandidate, undoMove } from "../store/boardSlice";
import { closeCandidateSidebar } from "../store/sidebarSlice";
import {
  selectFilteredCandidates,
  selectIsSidebarOpen,
  selectSelectedCandidateId,
} from "../store/selectors";
import type { Stage } from "../store/types";

export function useBoard() {
  const dispatch = useBoardDispatch();
  const candidates = useBoardSelector(selectFilteredCandidates);
  const selectedCandidateId = useBoardSelector(selectSelectedCandidateId);
  const isSidebarOpen = useBoardSelector(selectIsSidebarOpen);
  const canUndo = useBoardSelector((state) => state.board.lastAction !== null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingMoveRef = useRef(false);

  const selectedCandidate = useMemo(
    () =>
      selectedCandidateId
        ? candidates.find((candidate) => candidate.id === selectedCandidateId) ?? null
        : null,
    [candidates, selectedCandidateId],
  );

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

  const runUndo = useCallback(() => {
    if (!canUndo || pendingMoveRef.current) {
      return;
    }

    dispatch(undoMove());
    setErrorMessage(null);
  }, [canUndo, dispatch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const pressedUndo =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z";

      if (!pressedUndo) {
        return;
      }

      event.preventDefault();
      runUndo();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [runUndo]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const candidateId = active.data.current?.candidateId as string | undefined;
    const fromStage = active.data.current?.stage as Stage | undefined;
    const toStage = (over?.data.current?.stage ?? over?.id) as Stage | undefined;

    if (
      pendingMoveRef.current ||
      !candidateId ||
      !fromStage ||
      !toStage ||
      fromStage === toStage
    ) {
      return;
    }

    setErrorMessage(null);
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
  };

  const closeSidebar = () => {
    dispatch(closeCandidateSidebar());
  };

  return {
    handleDragEnd,
    selectedCandidate,
    isSidebarOpen,
    closeSidebar,
    canUndo,
    undoLastMove: runUndo,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
}
