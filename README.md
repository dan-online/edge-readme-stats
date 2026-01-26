# edge-readme-stats

**Fast, edge-native GitHub stats cards for your README**

Generate dynamic GitHub statistics cards that run anywhere - Cloudflare Workers, Vercel Edge, Deno Deploy, Bun, or self-hosted with Docker. Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats), rebuilt for performance and portability.

## Features

- 🚀 **Edge-first** - Sub-50ms response times globally
- 🌍 **Run anywhere** - Node.js, Bun, Deno, Cloudflare Workers, Vercel
- 🎨 **10 themes** - Plus full custom color support
- 📦 **Tiny footprint** - Minimal dependencies, fast cold starts
- 🔒 **Self-host friendly** - Own your rate limits with Docker

## Examples

![GitHub Stats](https://edge-readme-stats.workers.dev/stats?username=dan-online)
![GitHub Stats](https://edge-readme-stats.workers.dev/top-langs?username=dan-online)

## Quick Start

### Use the Public Instance

```md
![GitHub Stats](https://edge-readme-stats.workers.dev/stats?username=YOUR_USERNAME)
![Top Languages](https://edge-readme-stats.workers.dev/top-langs?username=YOUR_USERNAME)
```

### Self-host with Docker

```bash
docker run -p 3000:3000 -e GITHUB_TOKEN=ghp_xxx ghcr.io/dan-online/edge-readme-stats
```

### Deploy to Cloudflare Workers

```bash
cd entries/worker
npx wrangler deploy
```

## Cards

### Stats Card

```md
![Stats](https://edge-readme-stats.workers.dev/stats?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `default` | Theme name |
| `hide` | - | Hide stats: `stars,commits,prs,issues,contribs` |
| `show_icons` | `true` | Show icons |
| `hide_rank` | `false` | Hide rank circle |
| `hide_border` | `false` | Hide card border |

### Top Languages Card

```md
![Languages](https://edge-readme-stats.workers.dev/top-langs?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `default` | Theme name |
| `hide` | - | Hide languages (comma-separated) |
| `langs_count` | `5` | Number of languages (max 10) |
| `layout` | `default` | Layout: `default`, `compact`, `donut` |

## Themes

Available themes: `default`, `dark`, `radical`, `tokyonight`, `dracula`, `gruvbox`, `nord`, `catppuccin`, `onedark`, `github`

### Custom Colors

Override any theme with custom colors:

```
?theme=dark&title_color=ff0000&bg_color=000000
```

| Parameter | Description |
|-----------|-------------|
| `bg_color` | Background color |
| `title_color` | Title color |
| `text_color` | Text color |
| `icon_color` | Icon color |
| `border_color` | Border color |

## Self-Hosting

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Recommended | GitHub PAT for higher rate limits |
| `PORT` | No | Server port (default: 3000) |

### Docker

```bash
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=ghp_your_token \
  ghcr.io/dan-online/edge-readme-stats
```

### Cloudflare Workers

1. Clone the repo
2. Set secrets: `wrangler secret put GITHUB_TOKEN`
3. Deploy: `cd entries/worker && wrangler deploy`

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dan-online/edge-readme-stats)

## Development

```bash
# Install dependencies
yarn install

# Run dev server (Node.js)
yarn dev

# Run tests
yarn test

# Lint
yarn lint
```

## API Documentation

OpenAPI spec available at `/openapi`

## Attribution

This project is inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by Anurag Hazra.

## License

MIT
