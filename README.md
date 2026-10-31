# react-native-s3-bg-uploader-docs

This is the documentation page for [react-native-s3-bg-uploader](https://github.com/nikwebr/react-native-s3-bg-uploader).

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

It is a Next.js app with [Static Export](https://nextjs.org/docs/app/guides/static-exports) configured.

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## GitHub Agentic Workflow

The `agent-serviceuser` workflow uses the same gh-aw setup as the package
repository, without its post-merge documentation-sync agent. Assign an issue or
pull request to `agent-serviceuser`, request its review, or mention
`@agent-serviceuser` in a comment. New comments and reviews on threads assigned
to the agent also trigger it; it acts only on requests from users with admin,
maintainer, or write access.

Configure these repository Actions secrets before running the agent:

- `DEEPSEEK_API_KEY`: API key for the DeepSeek model used by the Pi engine.
- `GH_TOKEN`: token for `agent-serviceuser` with access to this repository and
  permission to write issues, pull requests, and repository contents.

Edit `.github/workflows/agent-serviceuser.md`, then regenerate and commit its
`.lock.yml` using gh-aw v0.93.5:

```bash
gh aw compile agent-serviceuser
```

Do not edit the generated lock workflow directly.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
