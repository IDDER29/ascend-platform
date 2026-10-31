const COLORS = [
  "#FFCE4A",
  "#FF6B4A",
  "#2e4bdb",
  "#3bc6a0",
  "#12B981",
  "#3BC6F0",
  "#fff",
];

// Deterministic (not Math.random()) so server and client render identically.
const pieces = (colors: string[]) =>
  Array.from({ length: 44 }, (_, i) => {
    const left = (i * 37) % 100;
    const size = 6 + ((i * 5) % 3) * 3;
    const color = colors[i % colors.length];
    const round = i % 3 === 0;
    const duration = 3.2 + (i % 6) * 0.6;
    const delay = -((i % 8) * 0.45);
    return { left, size, color, round, duration, delay };
  });

const PIECES = pieces(COLORS);

export function Confetti({ colors }: { colors?: string[] }) {
  const list = colors ? pieces(colors) : PIECES;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {list.map((p, i) => (
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
