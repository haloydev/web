import { IconBrandGithub } from '@tabler/icons-react';
import { ModeToggle } from './mode-toggle';
import { ButtonLink } from './ui/button-link';
import { VersionBadge } from './version-badge';

type NavbarProps = {
  showLinks?: boolean;
  version?: string;
};

export function Navbar({ showLinks = true, version }: NavbarProps) {
  return (
    <nav className="flex justify-center py-4 pr-6 pl-2">
      <div className="flex w-full justify-between">
        <a href="/" className="font-figtree px-4 text-2xl font-semibold">
          Haloy
        </a>
        <div className="flex items-center space-x-2">
          {showLinks && (
            <div className="mr-12">
              <a
                href="/docs/quickstart"
                className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium"
              >
                Docs
              </a>
              <a href="/blog" className="text-muted-foreground hover:text-foreground px-3 text-sm font-medium">
                Blog
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
      </div>
    </nav>
  );
}
