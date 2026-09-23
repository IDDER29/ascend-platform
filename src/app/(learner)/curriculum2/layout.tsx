export default function Curriculum2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto flex w-full max-w-[var(--layout-max)] flex-1 flex-col">
        {children}
      </div>
    </main>
  );
}
