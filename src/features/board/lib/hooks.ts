"use client";

import { useDispatch, useSelector, useStore } from "react-redux";

import type { BoardDispatch, BoardStore, BoardState } from "./store";

export const useBoardDispatch = useDispatch.withTypes<BoardDispatch>();
export const useBoardSelector = useSelector.withTypes<BoardState>();
export const useBoardStore = useStore.withTypes<BoardStore>();
