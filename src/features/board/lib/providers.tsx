"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { boardStore } from "./store";


export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(boardStore);

  return <Provider store={store}>{children}</Provider>;
}
