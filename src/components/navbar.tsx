import { IconBrandGithub, IconMenu2 } from '@tabler/icons-react';
import { Moon, Monitor, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { ButtonLink } from './ui/button-link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { VersionBadge } from './version-badge';

type NavbarProps = {
  showLinks?: boolean;
  version?: string;
};

export function Navbar({ showLinks = true, version }: NavbarProps) {
  const { setTheme } = useTheme();

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
              <a
                href="/newsletter"
                className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium"
              >
                Newsletter
              </a>
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
                  <DropdownMenuItem asChild>
                    <a href="/newsletter">Newsletter</a>
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
    </nav>
  );
}
