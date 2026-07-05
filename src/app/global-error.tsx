"use client";

// Only catches errors thrown by the root layout itself (very rare here,
// since layout.tsx does no data fetching) -- error.tsx below it handles
// everything else. Must render its own <html>/<body>; no design-system
// fonts/CSS are guaranteed to be loaded at this point, so this stays plain.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "system-ui, sans-serif",
          background: "#F1F0F7",
          color: "#181528",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Ascend hit a server error.</h1>
        <p style={{ maxWidth: 420, color: "#5C5773" }}>
          The whole app failed to load — not just this page. Your account and progress are
          untouched. Try again in a moment.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#7B4DFF,#C13AE0 58%,#FF6B4A)",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
