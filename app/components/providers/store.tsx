"use client"

import { useState, type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/store/store";

export function Provider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
