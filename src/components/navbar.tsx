import { IconBrandGithub } from '@tabler/icons-react';
import { ModeToggle } from './mode-toggle';
import { ButtonLink } from './ui/button-link';

type NavbarProps = {
  showLinks?: boolean;
};

export function Navbar({ showLinks = true }: NavbarProps) {
  return (
    <nav className="flex justify-center py-4 pr-6 pl-2">
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <a href="/" className="font-figtree px-4 text-2xl font-semibold">
            Haloy
          </a>
          {showLinks && (
            <>
              <a href="/docs/quickstart" className="text-muted-foreground hover:text-foreground px-3 text-sm">
                Docs
              </a>
              <a href="/blog" className="text-muted-foreground hover:text-foreground px-3 text-sm">
                Blog
              </a>
            </>
          )}
        </div>
        <div className="flex space-x-2">
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
