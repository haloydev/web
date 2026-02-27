export function NuxtjsLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="m12.146 8.583 -1.3 -2.09a1.046 1.046 0 0 0 -1.786 0.017l-5.91 9.908A1.046 1.046 0 0 0 4.047 18H7.96"
        strokeWidth={2}
      />
      <path
        d="M20.043 18c0.743 0 1.201 -0.843 0.82 -1.505l-4.044 -7.013a0.936 0.936 0 0 0 -1.638 0l-4.043 7.013c-0.382 0.662 0.076 1.505 0.819 1.505h8.086z"
        strokeWidth={2}
      />
    </svg>
  );
}
