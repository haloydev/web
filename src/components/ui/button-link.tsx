import { Button } from './button'

type BaseButtonProps = Parameters<typeof Button>[0]
type ButtonProps = Omit<BaseButtonProps, "asChild">

type LinkProps = {
  href: string;
  children: React.ReactNode
} & ButtonProps;

function ButtonLink({ href, children, ...props }: LinkProps) {
  return <Button asChild {...props}>
    <a href={href}>{children}</a>
  </Button>

}

export { ButtonLink }
