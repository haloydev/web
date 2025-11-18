import * as React from 'react';

import type { CollectionEntry } from 'astro:content';
import { ScrollArea } from './scroll-area';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

type CategoryWithPages = CollectionEntry<'docCategories'> & { pages: CollectionEntry<'docPages'>[] };
type DocsNavigationProps = {
  activeSlug: string;
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
    <nav className="space-y-6 px-4">
      {categoriesWithPages.map((category) => (
        <div key={category.id}>
          <h3 className="text-muted-foreground/70 mb-1 px-3 text-xs font-semibold tracking-tight">
            {category.data.title}
          </h3>
          <ul className="space-y-0.5">
            {category.pages.map((page) => (
              <li key={page.id}>
                <Button asChild variant={activeSlug === page.data.slug ? 'secondary' : 'ghost'} size="sm">
                  <a href={`/docs/${page.data.slug}`} className="text-sm font-medium">
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

export function DocsNavigation({ activeSlug, categoriesWithPages, ...props }: DocsNavigationProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="bg-background hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen pt-6">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <NavigationContent activeSlug={activeSlug} categoriesWithPages={categoriesWithPages} />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Header & Navigation */}
      <header className="bg-background sticky top-0 z-10 mx-2 flex items-center gap-4 lg:hidden">
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
    </>
  );
}
