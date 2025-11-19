import { IconBrandGithub } from '@tabler/icons-react';
import { ModeToggle } from './mode-toggle';
import { ButtonLink } from './ui/button-link';

export function Navbar() {
  return (
    <nav className="flex px-6 py-4">
      <div className="flex w-full justify-between">
        <a href="/" className="font-figtree text-2xl font-semibold">
          Haloy
        </a>
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
