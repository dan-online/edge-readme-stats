# edge-readme-stats

**Fast, edge-native GitHub stats cards for your README**

Generate dynamic GitHub statistics cards that run anywhere - Cloudflare Workers, Vercel Edge, Deno Deploy, Bun, or self-hosted with Docker. Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats), rebuilt for performance and portability.

## Features

- 🚀 **Edge-first** - Deploy close to requests for fast response times
- 🌍 **Run anywhere** - Node.js, Bun, Deno, Cloudflare Workers, Vercel, Docker
- 🎨 **10 themes** - Plus full custom color support
- 📦 **Tiny footprint** - Minimal dependencies, fast cold starts
- 🔒 **Self-host friendly** - Use your own GitHub token for higher rate limits

## Examples

![GitHub Stats](https://edge-readme-stats.dancodes.workers.dev/stats?username=dan-online)
![GitHub Stats](https://edge-readme-stats.dancodes.workers.dev/langs?username=dan-online)

> More coming soon...

## Quick Start

### Use the Public Instance

**[Try the Card Generator](https://edge-readme-stats.dancodes.workers.dev/generator)** to build your card visually!

Or use these URLs directly:

```md
![GitHub Stats](https://edge-readme-stats.dancodes.workers.dev/stats?username=YOUR_USERNAME)
![Top Languages](https://edge-readme-stats.dancodes.workers.dev/langs?username=YOUR_USERNAME)
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
![Stats](https://edge-readme-stats.dancodes.workers.dev/stats?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `github` | Theme name (see [Themes](#themes)) |
| `lang` | auto | Language code (see [Internationalization](#internationalization)) |
| `hide` | - | Hide stats: `stars,commits,prs,issues,contribs` |
| `show_icons` | `true` | Show icons |
| `hide_rank` | `false` | Hide rank circle |
| `hide_border` | `false` | Hide card border |
| `disable_animations` | `false` | Disable CSS animations |

### Top Languages Card

```md
![Languages](https://edge-readme-stats.dancodes.workers.dev/langs?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `github` | Theme name (see [Themes](#themes)) |
| `lang` | auto | Language code (see [Internationalization](#internationalization)) |
| `hide` | - | Hide languages (comma-separated) |
| `langs_count` | `5` | Number of languages (max 10) |
| `layout` | `compact` | Layout: `compact`, `donut` |
| `hide_border` | `false` | Hide card border |
| `disable_animations` | `false` | Disable CSS animations |

## Card Generator

The interactive **[Card Generator](https://edge-readme-stats.dancodes.workers.dev/generator)** lets you build and customize your cards visually:

- **Live Preview** - See your card update in real-time as you adjust settings
- **Card Type Tabs** - Switch between Stats and Languages cards
- **Theme Selection** - Browse all 10 built-in themes
- **Custom Colors** - Pick colors with color pickers or enter hex values
- **Language Selection** - Preview cards in different languages
- **One-Click Copy** - Copy markdown or URL directly to clipboard
- **Submit Custom Themes** - Create a GitHub issue with your custom theme colors

The generator creates a preview using sample data so you can see how your card will look before adding your username.

## Themes

Available themes: `github` (default), `dark`, `radical`, `tokyonight`, `dracula`, `gruvbox`, `nord`, `catppuccin`, `onedark`, `monokai`

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

## Internationalization

Cards support multiple languages via the `lang` parameter:

```
?lang=zh
```

| Code | Language | Status |
|------|----------|--------|
| `en` | English | Native |
| `zh` | Chinese | Machine translated |
| `es` | Spanish | Machine translated |
| `pt` | Portuguese | Machine translated |

The language is also auto-detected from your browser's `Accept-Language` header.

**Want to contribute translations?** We'd love help improving machine-translated locales or adding new languages. Edit [`core/src/lib/i18n.ts`](core/src/lib/i18n.ts) and submit a PR!

## Self-Hosting

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Recommended | GitHub PAT for higher rate limits |
| `PORT` | No | Server port (default: 3000) |

### Docker

```bash
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=ghp_your_token \ # (optional)
  ghcr.io/dan-online/edge-readme-stats
```

### Cloudflare Workers

1. Clone the repo
2. Set secrets: `yarn wrangler secret put GITHUB_TOKEN` (optional) 
3. Deploy: `yarn wrangler deploy`

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dan-online/edge-readme-stats)

## Development

```bash
# Install dependencies
yarn install

# Run dev server (Node.js)
yarn dev

# Run tests
yarn core:test

# Lint
yarn lint
```

## API Documentation

OpenAPI spec available at `/openapi`, Swagger UI at `/docs` when running the server.

## Attribution

This project is inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by Anurag Hazra.

## License

MIT
