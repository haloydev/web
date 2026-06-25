import { IconBrandGithub, IconMenu2 } from '@tabler/icons-react';
import { Moon, Monitor, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { ModeToggle } from './mode-toggle';
import { NewsletterDialog } from './newsletter-dialog';
import { Button } from './ui/button';
import { ButtonLink } from './ui/button-link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { TextLogo } from './text-logo';
import { VersionBadge } from './version-badge';
import { useEffect, useState } from 'react';

type NavbarProps = {
  showLinks?: boolean;
};

type LatestVersion = {
  version: string;
  url: string;
};

export function Navbar({ showLinks = true }: NavbarProps) {
  const { setTheme } = useTheme();
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [latestVersion, setLatestVersion] = useState<LatestVersion | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestVersion() {
      try {
        const response = await fetch('/api/latest-version', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = await response.json();
        if (typeof data?.version === 'string' && typeof data?.url === 'string') {
          setLatestVersion({ version: data.version, url: data.url });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load latest Haloy version:', error);
        }
      }
    }

    loadLatestVersion();

    return () => controller.abort();
  }, []);

  return (
    <nav className="flex justify-center py-4 pr-6 pl-2">
      <div className="flex w-full justify-between">
        <a href="/" className="inline-flex items-center px-4" aria-label="Haloy home">
          <TextLogo />
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
              <a
                href="/docs/why-haloy"
                className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium"
              >
                Why Haloy
              </a>
              <button
                onClick={() => setNewsletterOpen(true)}
                className="text-muted-foreground hover:text-foreground cursor-pointer px-3 text-sm font-medium"
              >
                Newsletter
              </button>
            </div>
          )}

          <div className="flex min-w-[7.75rem] justify-end">
            {latestVersion && <VersionBadge version={latestVersion.version} href={latestVersion.url} />}
          </div>
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
                  <DropdownMenuItem asChild>
                    <a href="/docs/why-haloy">Why Haloy</a>
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
              {latestVersion && (
                <DropdownMenuItem asChild>
                  <a href={latestVersion.url} target="_blank" rel="noopener noreferrer">
                    v{latestVersion.version}
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

      <NewsletterDialog open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </nav>
  );
}
