// import React from "react";

export default function PageLoader() {
  return (
    <div
      className="min-h-[200px] w-full flex items-center justify-center"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        className="h-10 w-10 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin"
        role="status"
      />
    </div>
  );
}

