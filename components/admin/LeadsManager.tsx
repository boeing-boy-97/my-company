'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Lead } from '@/lib/store';
import { formatDate } from '@/lib/utils';

const STATUSES = ['all', 'new', 'contacted', 'qualified', 'discovery', 'proposal', 'negotiation', 'won', 'lost'] as const;
type SortKey = 'date' | 'budget' | 'company';
const PAGE_SIZE = 10;

const budgetRank = (b: string) => {
  if (b.includes('25,000+')) return 5;
  if (b.includes('10,000–25,000')) return 4;
  if (b.includes('5,000–10,000')) return 3;
  if (b.includes('1,000–5,000')) return 2;
  if (b.includes('Under')) return 1;
  return 0;
};

const statusTone: Record<string, string> = {
  new: 'bg-accenthalo text-accentdeep border-accent/25',
  contacted: 'border-line text-soft',
  qualified: 'border-ok/25 bg-ok/5 text-ok',
  discovery: 'border-accent/25 bg-accenthalo text-accentdeep',
  proposal: 'border-warn/25 bg-warn/5 text-warn',
  negotiation: 'border-warn/30 bg-warn/10 text-warn',
  won: 'border-ok/40 bg-ok/10 text-ok',
  lost: 'border-line text-faint',
};

export default function LeadsManager({ leads, counts }: { leads: Lead[]; counts: Record<string, number> }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('all');
  const [sort, setSort] = useState<SortKey>('date');
  const [page, setPage] = useState(1);
  const [showArchived, setShowArchived] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = leads.filter((l) => {
      if (l.archived && !showArchived) return false;
      const statusOk = status === 'all' || l.status === status;
      const qOk =
        !q ||
        [l.reference, l.contactName, l.companyName, l.email, l.objective, l.projectTypes.join(' ')].some((v) => v.toLowerCase().includes(q));
      return statusOk && qOk;
    });
    list.sort((a, b) => {
      if (sort === 'date') return b.createdAt.localeCompare(a.createdAt);
      if (sort === 'budget') return budgetRank(b.budgetRange) - budgetRank(a.budgetRange);
      return (a.companyName || a.contactName).localeCompare(b.companyName || b.contactName);
    });
    return list;
  }, [leads, query, status, sort, showArchived]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const paged = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      {/* status filter pills with counts */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            aria-pressed={status === s}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition-all ${
              status === s ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-soft hover:border-ink/30'
            }`}
          >
            {s} {s !== 'all' && <span className={status === s ? 'text-paper/60' : 'text-faint'}>({counts[s] || 0})</span>}
          </button>
        ))}
      </div>

      {/* toolbar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[320px]">
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search leads…" aria-label="Search leads" className="field !py-2.5 pl-10 text-[13.5px]" />
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="lead-sort" className="font-mono text-[10px] uppercase tracking-tech text-faint">
            Sort
          </label>
          <select id="lead-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="field w-auto !py-2.5 text-[13px]">
            <option value="date">Newest first</option>
            <option value="budget">Budget (high → low)</option>
            <option value="company">Company A–Z</option>
          </select>
          <label className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-soft">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="h-3.5 w-3.5 accent-[#17191E]" />
            Show archived
          </label>
        </div>
      </div>

      {/* table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-line">
              {['Reference', 'Contact', 'Project type', 'Budget', 'Owner', 'Status', 'Received'].map((h) => (
                <th key={h} className="px-5 py-3.5 font-mono text-[9.5px] uppercase tracking-tech text-faint">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center text-[14px] text-faint">
                  No leads match this view. New submissions from the website appear here instantly.
                </td>
              </tr>
            )}
            {paged.map((lead) => (
              <tr key={lead.id} className="group border-b border-linedark transition-colors last:border-b-0 hover:bg-paper">
                <td className="px-5 py-4">
                  <Link href={`/admin/leads/${lead.id}`} className="font-mono text-[12.5px] font-semibold text-accentdeep underline-offset-2 hover:underline">
                    {lead.reference}
                  </Link>
                  {lead.archived && <span className="ml-2 rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-faint">archived</span>}
                </td>
                <td className="px-5 py-4">
                  <p className="text-[13.5px] font-medium text-ink">{lead.contactName}</p>
                  <p className="text-[11.5px] text-faint">{lead.companyName || lead.email}</p>
                </td>
                <td className="max-w-[220px] truncate px-5 py-4 text-[13px] text-soft">{lead.projectTypes.join(', ') || lead.kind}</td>
                <td className="px-5 py-4 font-mono text-[12px] text-soft">
                  {lead.budgetRange === 'Not shared yet' ? '—' : `${lead.budgetRange}${lead.currency && lead.budgetRange !== 'Not sure' ? ` ${lead.currency}` : ''}`}
                </td>
                <td className="px-5 py-4 text-[13px] text-soft">{lead.timeline}</td>
                <td className="px-5 py-4 text-[12.5px] text-soft">{lead.owner || 'Unassigned'}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${statusTone[lead.status]}`}>{lead.status}</span>
                </td>
                <td className="px-5 py-4 text-[12px] text-faint">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10.5px] uppercase tracking-tech text-faint">
          {visible.length} of {leads.length} leads shown
        </p>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={safePage <= 1} className="rounded-full border border-line px-3.5 py-1.5 text-[12px] font-medium text-soft transition-colors hover:text-ink disabled:opacity-40">← Prev</button>
            <span className="font-mono text-[11px] text-faint">{safePage} / {pages}</span>
            <button onClick={() => setPage((v) => Math.min(pages, v + 1))} disabled={safePage >= pages} className="rounded-full border border-line px-3.5 py-1.5 text-[12px] font-medium text-soft transition-colors hover:text-ink disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
