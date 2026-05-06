'use client';

import { useEffect, useId, useRef } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      });
      el.innerHTML = '';
      const { svg } = await mermaid.render(`mermaid-${id}`, chart);
      el.innerHTML = svg;
    }

    void render();
  }, [chart, id, resolvedTheme]);

  return <div ref={ref} className="my-6 overflow-x-auto" />;
}
