# Project Instructions

## Generated Files

The files in `public/markdown/` are generated on build. Do not edit them directly.

## Code Component Formatting

Always use the `<Code>` component for code blocks in `.mdx` files. Never use markdown backtick fenced code blocks. Files using `<Code>` must import it: `import Code from '@/components/code.astro';`

For single-line code, use the inline syntax:
```
<Code code="npm install package" lang="bash" />
```

For multi-line code, start on the second line and indent each line with two spaces:
```
<Code lang="typescript" code={`
  const config = {
    enabled: true,
    timeout: 5000,
  };
`} />
```

Without the two-space indentation, multi-line code blocks will not render correctly.
