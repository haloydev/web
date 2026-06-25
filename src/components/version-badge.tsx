type VersionBadgeProps = {
  version: string;
  href?: string;
};

export function VersionBadge({ version, href = 'https://github.com/haloydev/haloy/releases' }: VersionBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground border-border hover:border-foreground/30 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all hover:scale-105"
    >
      v{version}
    </a>
  );
}
