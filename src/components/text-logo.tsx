type TextLogoProps = {
  className?: string;
};

export function TextLogo({ className = 'h-6 w-auto' }: TextLogoProps) {
  return (
    <>
      <img src="/haloy-logo-text-light.svg" alt="Haloy" className={`${className} dark:hidden`} />
      <img src="/haloy-logo-text-dark.svg" alt="Haloy" className={`hidden ${className} dark:block`} />
    </>
  );
}
