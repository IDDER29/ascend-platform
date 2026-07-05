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
  return (
    <div className="my-6 not-prose">
      <div className="mb-2 font-display text-[15.5px] font-bold text-[#2A2540]">
        {decodeEntities(caption)}
      </div>
      <table className="w-full max-w-xs overflow-hidden rounded-xl border border-divider text-center">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="border-b border-divider bg-[#FBFAFE] px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-wide text-ink-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-divider px-4 py-2.5 font-mono text-[14px] font-semibold text-[#413D50] last:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
