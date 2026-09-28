import { appendFile } from 'fs/promises';
import path from 'path';

// Privacy-aware analytics: events are appended to a local JSONL file.
// No personal data, no third-party scripts. Swap the sink for Plausible
// or PostHog later by changing this one function.

const FILE = path.join(process.cwd(), 'data', 'analytics.jsonl');

export async function track(event: string, props?: Record<string, string | number>) {
  try {
    const line = JSON.stringify({ event, props: props ?? {}, at: new Date().toISOString() });
    await appendFile(FILE, line + '\n', 'utf8');
  } catch {
    /* analytics must never break the app */
  }
}
