"use client";

import { useEffect } from "react";
import { LuCircleAlert, LuRefreshCw } from "react-icons/lu";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="card max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <LuCircleAlert className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="text-lg font-bold text-neutral-800">
          ఏదో లోపం సంభవించింది
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          దయచేసి మళ్లీ ప్రయత్నించండి. సమస్య కొనసాగితే అడ్మిన్‌ను సంప్రదించండి.
        </p>
        <button onClick={reset} className="btn-primary mt-6">
          <LuRefreshCw className="h-4 w-4" />
          మళ్లీ ప్రయత్నించు
        </button>
      </div>
    </div>
  );
}
