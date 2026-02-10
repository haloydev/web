import { Button } from './button'

type BaseButtonProps = Parameters<typeof Button>[0]
type ButtonProps = Omit<BaseButtonProps, "asChild">

type LinkProps = {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode
} & ButtonProps;

function ButtonLink({ href, target, rel, children, ...props }: LinkProps) {
  const isExternal = href.startsWith('http');
  const linkTarget = target ?? (isExternal ? '_blank' : undefined);
  const linkRel = rel ?? (isExternal ? 'noopener noreferrer' : undefined);

  return <Button asChild {...props}>
    <a href={href} target={linkTarget} rel={linkRel}>{children}</a>
  </Button>
}

export { ButtonLink }
