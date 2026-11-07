"use client";

import * as React from "react";
import { Button } from "@workspace/ui";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  React.useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold text-slate-900">An unexpected system error occurred</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        {error.message || "Please refresh or contact the system administrator."}
      </p>
      <div className="mt-6">
        <Button onClick={() => reset()} variant="primary">
          Try Again
        </Button>
      </div>
    </div>
  );
}

