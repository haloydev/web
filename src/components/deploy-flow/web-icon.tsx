export function WebIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 10 10" className={className}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 9.5a4.5 4.5 0 1 0 0 -9 4.5 4.5 0 0 0 0 9Z"
        strokeWidth={1}
      />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M0.5 5h9" strokeWidth={1} />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.731 5A7.77 7.77 0 0 1 5 9.5 7.771 7.771 0 0 1 3.269 5 7.771 7.771 0 0 1 5 0.5 7.77 7.77 0 0 1 6.731 5v0Z"
        strokeWidth={1}
      />
    </svg>
  );
}
