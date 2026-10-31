function decodeEntities(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function TruthTable({ caption, rowsJson }: { caption: string; rowsJson: string }) {
  const rows: string[][] = JSON.parse(rowsJson);
  const [header, ...body] = rows;
  // A column of sentences (any cell with words, longer than a short label) wraps in the body face;
  // bits, numbers and mnemonics stay on one line in mono.
  const isProse = (cell: string) => cell.includes(" ") && cell.length > 12 && !/^[01 ]+$/.test(cell);
  const proseColumn = header.map((_, j) => body.some((row) => isProse(row[j] ?? "")));
  return (
    <div className="my-6 not-prose max-w-full overflow-x-auto">
      <div className="mb-2 font-display text-[15.5px] font-bold text-ink">
        {decodeEntities(caption)}
      </div>
      {/* Sized to its content: a truth table stays compact, a table of instructions gets room to read. */}
      <table className="w-auto min-w-[14rem] max-w-full overflow-hidden rounded-xl border border-card-border text-center">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="border-b border-divider bg-elevated/60 px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-wide text-ink-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                const prose = proseColumn[j];
                return (
                  <td
                    key={j}
                    className={`border-b border-divider px-4 py-2.5 text-[14px] text-ink-secondary last:border-b-0 ${
                      prose ? "min-w-[12rem] text-left font-medium" : "whitespace-nowrap font-mono font-semibold"
                    }`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
