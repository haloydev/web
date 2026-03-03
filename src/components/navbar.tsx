import { IconBrandGithub, IconMenu2 } from '@tabler/icons-react';
import { Moon, Monitor, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { ModeToggle } from './mode-toggle';
import { NewsletterSignup } from './newsletter-signup';
import { Button } from './ui/button';
import { ButtonLink } from './ui/button-link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { VersionBadge } from './version-badge';
import { useState } from 'react';

type NavbarProps = {
  showLinks?: boolean;
  version?: string;
};

export function Navbar({ showLinks = true, version }: NavbarProps) {
  const { setTheme } = useTheme();
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <nav className="flex justify-center py-4 pr-6 pl-2">
      <div className="flex w-full justify-between">
        <a href="/" className="font-figtree px-4 text-2xl font-semibold">
          Haloy
        </a>

        {/* Desktop */}
        <div className="hidden items-center space-x-2 lg:flex">
          {showLinks && (
            <div className="mr-12">
              <a
                href="/docs"
                className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium"
              >
                Docs
              </a>
              <a href="/blog" className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium">
                Blog
              </a>
              <button
                onClick={() => setNewsletterOpen(true)}
                className="text-muted-foreground hover:text-foreground cursor-pointer px-3 text-sm font-medium"
              >
                Newsletter
              </button>
            </div>
          )}

          {version && <VersionBadge version={version} />}
          <ModeToggle />
          <ButtonLink
            href="https://github.com/haloydev/haloy"
            variant="outline"
            size="icon"
            aria-label="View Haloy on GitHub"
          >
            <IconBrandGithub />
          </ButtonLink>
        </div>

        {/* Mobile */}
        <div className="flex items-center lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <IconMenu2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2 [&_[data-slot=dropdown-menu-item]]:px-3 [&_[data-slot=dropdown-menu-item]]:py-2.5">
              {showLinks && (
                <>
                  <DropdownMenuItem asChild>
                    <a href="/docs">Docs</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/blog">Blog</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setNewsletterOpen(true)}>
                    Newsletter
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild>
                <a href="https://github.com/haloydev/haloy" target="_blank" rel="noopener noreferrer">
                  <IconBrandGithub />
                  GitHub
                </a>
              </DropdownMenuItem>
              {version && (
                <DropdownMenuItem asChild>
                  <a href="https://github.com/haloydev/haloy/releases" target="_blank" rel="noopener noreferrer">
                    v{version}
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
        <DialogContent
          className="w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border-black/[0.06] p-0 sm:w-full sm:max-w-md dark:border-white/[0.06]"
          onInteractOutside={(event) => {
            // Keep dialog open when extension UI (like password managers) is clicked.
            event.preventDefault();
          }}
        >
          <div className="bg-emerald-500/[0.04] px-8 pt-8 pb-6 dark:bg-emerald-500/[0.06]">
            <DialogHeader>
              <DialogTitle className="font-figtree text-xl font-bold">Stay in the loop</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-sm leading-relaxed">
                Practical notes on Docker deploys, ops trade-offs, and self-hosted infrastructure.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-8 pt-6 pb-8">
            <NewsletterSignup variant="inline" />
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
