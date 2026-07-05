const COLORS = ["#FFCE4A", "#FF6B4A", "#7B4DFF", "#C13AE0", "#12B981", "#3BC6F0", "#fff"];

// Deterministic (not Math.random()) so server and client render identically.
const PIECES = Array.from({ length: 44 }, (_, i) => {
  const left = (i * 37) % 100;
  const size = 6 + ((i * 5) % 3) * 3;
  const color = COLORS[i % COLORS.length];
  const round = i % 3 === 0;
  const duration = 3.2 + (i % 6) * 0.6;
  const delay = -((i % 8) * 0.45);
  return { left, size, color, round, duration, delay };
});

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="animate-confetti-fall absolute -top-5"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
