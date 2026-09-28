'use client';
import { useEffect, useState } from 'react';

export default function CaseNav({ sections }: { sections: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState(sections[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Case study sections" className="sticky top-32 hidden lg:block">
      <p className="label-tech mb-4">On this page</p>
      <ul className="space-y-1 border-l border-line">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`-ml-px block border-l-2 py-1.5 pl-4 text-[13px] transition-all duration-200 ${
                active === s.id ? 'border-accent font-medium text-ink' : 'border-transparent text-faint hover:text-soft'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
