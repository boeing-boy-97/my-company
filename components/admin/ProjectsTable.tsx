'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/primitives';
import { formatDate } from '@/lib/utils';

export interface ProjectRow {
  id: string;
  name: string;
  client: string;
  status: string;
  friendlyStatus: string;
  progress: number;
  milestonesDone: number;
  milestonesTotal: number;
  nextMilestone: string;
  createdAt: string;
}

export default function ProjectsTable({ rows, statuses }: { rows: ProjectRow[]; statuses: Array<{ value: string; label: string }> }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (!needle) return true;
      return r.name.toLowerCase().includes(needle) || r.client.toLowerCase().includes(needle);
    });
  }, [rows, q, status]);

  return (
    <div className="mt-8">
      {/* search + filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="project-search" className="sr-only">Search projects</label>
        <input
          id="project-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by project or client…"
          className="w-full max-w-[320px] rounded-full border border-line bg-surface px-5 py-2.5 text-[13.5px] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <label htmlFor="project-status" className="sr-only">Filter by status</label>
        <select
          id="project-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border border-line bg-surface px-4 py-2.5 text-[13px] text-soft focus:border-accent focus:outline-none"
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <p className="ml-auto font-mono text-[11px] text-faint">{filtered.length} of {rows.length}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching projects" body="Adjust the search text or status filter." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-line">
                {['Project', 'Client', 'Status', 'Progress', 'Milestones', 'Next', 'Started'].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-mono text-[10px] uppercase tracking-tech text-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="px-5 py-4">
                    <Link href={`/admin/projects/${p.id}`} className="link-underline text-[13.5px] font-medium text-ink">{p.name}</Link>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-soft">{p.client}</td>
                  <td className="px-5 py-4"><span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-soft">{p.friendlyStatus}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-[4px] w-20 overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="font-mono text-[10.5px] text-faint">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11.5px] text-soft">{p.milestonesDone}/{p.milestonesTotal}</td>
                  <td className="max-w-[180px] truncate px-5 py-4 text-[12.5px] text-soft">{p.nextMilestone}</td>
                  <td className="px-5 py-4 font-mono text-[10.5px] text-faint">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
