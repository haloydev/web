import type { MarkdownHeading } from 'astro';
import * as React from 'react';

export function DocsTableOfContents({ headings }: { headings: MarkdownHeading[] }) {
  if (headings.length === 0) {
    return null;
  }

  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0% 0% -80% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all headings
    const headingElements = headings.map((heading) => document.getElementById(heading.slug)).filter(Boolean);

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  return (
    <div className="sticky top-0 pt-6">
      <span className="text-muted-foreground text-xs font-medium">On This Page</span>
      <ul className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            data-depth={heading.depth}
            data-active={activeId === heading.slug}
            className="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-sm data-[depth=3]:pl-4 data-[depth=4]:pl-6"
          >
            <a href={`#${heading.slug}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
