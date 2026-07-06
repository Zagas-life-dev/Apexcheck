export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-600/20">
        Placeholder first-draft text — not legal advice. Please have this reviewed by a
        qualified professional before relying on it, as it touches liability and warranty
        for medical devices.
      </div>
      <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
