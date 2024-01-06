'use client'

import { PandaProvider } from "panda-wallet-provider";

export function PandaWrapper({ children }: {
    children: React.ReactNode
  }) {
  return (
    <PandaProvider>
      {children}
    </PandaProvider>
  );
}

