"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useBoardDispatch, useBoardSelector } from "../lib/hooks";
import { clearFilters, setFilters } from "../store/boardSlice";
import { selectFilters } from "../store/selectors";
import { useEffect, useRef, useState } from "react";

const ROLE_OPTIONS = ["Frontend", "Backend", "Full Stack"] as const;
const SCORE_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

export function FilterBar() {
  const dispatch = useBoardDispatch();
  const filters = useBoardSelector(selectFilters);
  const [nameQuery, setNameQuery] = useState(filters.nameQuery ?? "");
  const debounceRef = useRef<number | null>(null);

 

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      const nextQuery = nameQuery;
      if ((filters.nameQuery ?? "") !== nextQuery) {
        dispatch(
          setFilters({
            ...filters,
            nameQuery: nextQuery,
          }),
        );
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [dispatch, filters, nameQuery]);

  const onRoleChange = (value: string) => {
    dispatch(
      setFilters({
        ...filters,
        role: value === "" ? null : value,
      }),
    );
  };

  const onMinScoreChange = (value: string) => {
    const minScore = Number(value);
    dispatch(
      setFilters({
        ...filters,
        minScore: Number.isNaN(minScore) ? 0 : minScore,
      }),
    );
  };

  const onMaxScoreChange = (value: string) => {
    const maxScore = Number(value);
    dispatch(
      setFilters({
        ...filters,
        maxScore: Number.isNaN(maxScore) ? 100 : maxScore,
      }),
    );
  };

  return (
    <section className="mb-4 flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
        <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
        <span className="font-medium">Filters</span>
      </div>

      <label className="relative">
        <span className="sr-only">Search candidates by name</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={nameQuery}
          id="nameQuery"
          onChange={(event) => setNameQuery(event.target.value)}
          placeholder="Search name…"
          className="h-10 w-56 rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <label className="relative">
        <span className="sr-only">Role</span>
        <select
          value={filters.role ?? ""}
          onChange={(event) => onRoleChange(event.target.value)}
          className="h-10 appearance-none rounded-xl border border-zinc-200 bg-white pl-3 pr-9 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </label>

      <label className="relative">
        <span className="sr-only">Min score</span>
        <select
          value={String(filters.minScore)}
          onChange={(event) => onMinScoreChange(event.target.value)}
          className="h-10 appearance-none rounded-xl border border-zinc-200 bg-white pl-3 pr-9 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {SCORE_OPTIONS.map((value) => (
            <option key={value} value={String(value)}>
              Score: {value}+
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </label>

      <label className="relative">
        <span className="sr-only">Max score</span>
        <select
          value={String(filters.maxScore)}
          onChange={(event) => onMaxScoreChange(event.target.value)}
          className="h-10 appearance-none rounded-xl border border-zinc-200 bg-white pl-3 pr-9 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {SCORE_OPTIONS.map((value) => (
            <option key={value} value={String(value)}>
              Up to: {value}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </label>

      <button
        type="button"
        onClick={() => dispatch(clearFilters())}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
      >
        <X className="h-4 w-4" />
        Clear
      </button>
    </section>
  );
}
