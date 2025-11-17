import * as React from 'react';

import type { CollectionEntry } from 'astro:content';
import { ScrollArea } from './scroll-area';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

type CategoryWithPages = CollectionEntry<'docCategories'> & { pages: CollectionEntry<'docPages'>[] };
type DocsNavigationProps = {
  activeSlug: string;
  children: React.ReactNode;
  categoriesWithPages: CategoryWithPages[];
};

function NavigationContent({
  activeSlug,
  categoriesWithPages,
}: {
  activeSlug: string;
  categoriesWithPages: CategoryWithPages[];
}) {
  return (
    <nav className="space-y-6 px-4 py-6">
      {categoriesWithPages.map((category) => (
        <div key={category.id}>
          <h3 className="text-muted-foreground/70 mb-2 px-4 text-sm font-semibold tracking-tight">
            {category.data.title}
          </h3>
          <ul className="space-y-1">
            {category.pages.map((page) => (
              <li key={page.id}>
                <Button asChild variant={activeSlug === page.data.slug ? 'secondary' : 'ghost'}>
                  <a href={`/docs/${page.data.slug}`} className="text-sm font-semibold">
                    {page.data.title}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsNavigation({ activeSlug, children, categoriesWithPages, ...props }: DocsNavigationProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen max-w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="bg-background hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <NavigationContent activeSlug={activeSlug} categoriesWithPages={categoriesWithPages} />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Header & Navigation */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 px-4 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="default">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                <span className="font-bold">Documentation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <NavigationContent activeSlug={activeSlug} categoriesWithPages={categoriesWithPages} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <div className="max-w-full px-4 pt-6 pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}
