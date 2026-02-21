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

## Haloy Config Examples

When writing `haloy.yaml` examples in blog posts or docs, always cross-reference `/src/data/docs/configuration/02-configuration-reference.mdx` to verify field names and structure. Key points:

- There is no `host` field. Use `domains` (an array of objects with a `domain` key).
- There is no top-level `build` field. Image building is configured via the `image` object with `build_config`. A Dockerfile in the project root is auto-detected.
- `env` is an array of objects with `name` and `value`/`from` fields, not a key-value map.
- `server` is required and specifies the Haloy server API URL.
