import Reveal from '@/components/ui/Reveal';

const LAYERS = [
  { code: 'L1', name: 'Experience', note: 'Web apps · mobile apps · admin consoles', items: ['Next.js', 'Flutter', 'Dashboards'] },
  { code: 'L2', name: 'API & Logic', note: 'Typed services, business rules, integrations', items: ['Node.js', 'Python', 'REST / Webhooks'] },
  { code: 'L3', name: 'AI Layer', note: 'Agents, classification, document intelligence', items: ['LLMs', 'RAG', 'Workflow engines'] },
  { code: 'L4', name: 'Data & Infrastructure', note: 'Managed, backed up, monitored', items: ['PostgreSQL', 'Object storage', 'Cloud hosting'] },
];

export default function ArchDiagram() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-7" role="img" aria-label="Layered software architecture diagram from user interfaces down to data infrastructure">
      <div className="flex items-center justify-between">
        <span className="label-tech">Reference architecture</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-faint">4 layers</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {LAYERS.map((layer, i) => (
          <Reveal key={layer.code} delay={i * 100}>
            <div className="group rounded-xl border border-line bg-paper p-4 transition-all duration-300 hover:border-ink/25 hover:shadow-[0_10px_30px_-18px_rgba(23,25,30,0.3)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] text-accent">{layer.code}</span>
                  <span className="font-display text-[15.5px] font-semibold text-ink">{layer.name}</span>
                </p>
                <span className="text-[12px] text-faint">{layer.note}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {layer.items.map((it) => (
                  <span key={it} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[10.5px] text-soft">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3 font-mono text-[9.5px] uppercase tracking-tech text-faint">
        <span className="h-px w-10 bg-line" aria-hidden />
        Security, monitoring & backups run through every layer
        <span className="h-px w-10 bg-line" aria-hidden />
      </div>
    </div>
  );
}
