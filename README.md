# edge-readme-stats

**Fast, edge-native GitHub stats cards for your README**

Generate dynamic GitHub statistics cards that run anywhere - Cloudflare Workers, Vercel Edge, Deno Deploy, Bun, or self-hosted with Docker. Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats), rebuilt for performance and portability.

## Features

- 🚀 **Edge-first** - Deploy close to requests for fast response times
- 🌍 **Run anywhere** - Node.js, Bun, Deno, Cloudflare Workers, Vercel, Docker
- 🎨 **11 themes** - Including auto dark/light mode, plus custom colors
- 📦 **Tiny footprint** - Minimal dependencies, fast cold starts
- 🔒 **Self-host friendly** - Use your own GitHub token for higher rate limits

## Examples

### Stats Card

![GitHub Stats](https://edge-readme-stats.dancodes.online/stats?username=dan-online&size=md)
![GitHub Stats Radical](https://edge-readme-stats.dancodes.online/stats?username=dan-online&theme=radical&size=md)
![GitHub Stats Custom](https://edge-readme-stats.dancodes.online/stats?username=dan-online&bg_color=0d1117&title_color=58a6ff&text_color=c9d1d9&icon_color=f0883e&border_color=30363d&size=md)

### Top Languages

![Top Languages](https://edge-readme-stats.dancodes.online/langs?username=dan-online&theme=tokyonight&size=md)
![Top Languages Dracula](https://edge-readme-stats.dancodes.online/langs?username=dan-online&theme=dracula&langs_count=3&size=md)
![Top Languages Donut](https://edge-readme-stats.dancodes.online/langs?username=dan-online&theme=catppuccin&layout=donut&size=md)

### Contribution Heatmap

![Heatmap Grid](https://edge-readme-stats.dancodes.online/heatmap?username=dan-online&theme=nord&size=md)
![Heatmap Custom](https://edge-readme-stats.dancodes.online/heatmap?username=dan-online&time_range=90&theme=monokai&size=md)
![Heatmap Compact](https://edge-readme-stats.dancodes.online/heatmap?username=dan-online&theme=gruvbox&layout=compact&size=md)

## Quick Start

### Use the Public Instance

**[Try the Card Generator](https://edge-readme-stats.dancodes.online/generator)** to build your card visually!

Or use these URLs directly:

```md
![GitHub Stats](https://edge-readme-stats.dancodes.online/stats?username=YOUR_USERNAME)
![Top Languages](https://edge-readme-stats.dancodes.online/langs?username=YOUR_USERNAME)
![Contribution Heatmap](https://edge-readme-stats.dancodes.online/heatmap?username=YOUR_USERNAME)
```

### Self-Hosting

#### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Recommended | GitHub PAT for higher rate limits |
| `PORT` | No | Server port (default: 3000) |

#### Docker

```bash
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=ghp_your_token \
  ghcr.io/dan-online/edge-readme-stats
```

#### Cloudflare Workers

1. Clone the repo
2. Set secrets: `npx wrangler secret put GITHUB_TOKEN`
3. Deploy: `npx wrangler deploy`

#### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dan-online/edge-readme-stats)

## Cards

### Stats Card

```md
![Stats](https://edge-readme-stats.dancodes.online/stats?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `github` | Theme name (see [Themes](#themes)) |
| `lang` | auto | Language code (see [Internationalization](#internationalization)) |
| `size` | `lg` | Card size: `sm` (50%), `md` (75%), `lg` (100%), `xl` (125%) |
| `icons` | `true` | Show icons |
| `rank` | `true` | Show rank circle |
| `stars` | `true` | Show stars count |
| `commits` | `true` | Show commits count |
| `prs` | `true` | Show pull requests count |
| `issues` | `true` | Show issues count |
| `contribs` | `true` | Show contributed to count |
| `border` | `true` | Show card border |
| `animations` | `true` | Enable CSS animations |

### Top Languages Card

```md
![Languages](https://edge-readme-stats.dancodes.online/langs?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `github` | Theme name (see [Themes](#themes)) |
| `lang` | auto | Language code (see [Internationalization](#internationalization)) |
| `size` | `lg` | Card size: `sm` (50%), `md` (75%), `lg` (100%), `xl` (125%) |
| `hide` | - | Hide languages (comma-separated) |
| `langs_count` | `6` | Number of languages (max 6) |
| `layout` | `compact` | Layout: `compact`, `donut` |
| `border` | `true` | Show card border |
| `animations` | `true` | Enable CSS animations |

### Contribution Heatmap Card

```md
![Heatmap](https://edge-readme-stats.dancodes.online/heatmap?username=dan-online)
```

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `username` | required | GitHub username |
| `theme` | `github` | Theme name (see [Themes](#themes)) |
| `lang` | auto | Language code (see [Internationalization](#internationalization)) |
| `size` | `lg` | Card size: `sm` (50%), `md` (75%), `lg` (100%), `xl` (125%) |
| `layout` | `grid` | Layout: `grid`, `compact` |
| `time_range` | `365` | Number of days to show (1-365) |
| `total` | `true` | Show total contributions |
| `current_streak` | `true` | Show current streak |
| `longest_streak` | `true` | Show longest streak |
| `border` | `true` | Show card border |
| `animations` | `true` | Enable CSS animations |

## Card Generator

The interactive **[Card Generator](https://edge-readme-stats.dancodes.online/generator)** lets you build and customize your cards visually:

- **Live Preview** - See your card update in real-time as you adjust settings
- **Card Type Tabs** - Switch between Stats, Languages, and Heatmap cards
- **Theme Selection** - Browse all 11 built-in themes
- **Custom Colors** - Pick colors with color pickers or enter hex values
- **Language Selection** - Preview cards in different languages
- **One-Click Copy** - Copy markdown or URL directly to clipboard
- **Submit Custom Themes** - Create a GitHub issue with your custom theme colors

The generator creates a preview using sample data so you can see how your card will look before adding your username.

## Themes

Available themes: `github` (default), `light`, `dark`, `radical`, `tokyonight`, `dracula`, `gruvbox`, `nord`, `catppuccin`, `onedark`, `monokai`

### Auto Dark/Light Mode

The default `github` theme automatically adapts to the viewer's system preference using CSS `prefers-color-scheme` media queries:

- **Dark mode** - Uses GitHub's dark theme colors
- **Light mode** - Uses GitHub's light theme colors

This means your card will match GitHub's interface whether the viewer is using dark or light mode. No configuration needed - it just works!

If you prefer a fixed theme, use `theme=light` or `theme=dark` for explicit control.

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

| Endpoint | Description |
|----------|-------------|
| `GET /` | Returns version and repo info |
| `GET /stats` | Generate stats card SVG |
| `GET /langs` | Generate languages card SVG |
| `GET /heatmap` | Generate contribution heatmap card SVG |
| `GET /generator` | Interactive card builder UI |
| `GET /docs` | Swagger UI |
| `GET /openapi` | OpenAPI spec (JSON) |

## Why edge-readme-stats?

The original [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by Anurag Hazra is a great project that inspired this one. It just didn't quite suit my needs, so I built this alternative with a focus on:

- **Edge deployment** - Native support for Cloudflare Workers, Deno Deploy, and other edge runtimes
- **Multi-platform** - Run on Vercel, Cloudflare, Deno, Bun, Node.js, or Docker
- **TypeScript** - Full type safety with Valibot schema validation
- **Modern tooling** - Hono framework, JSX/TSX for SVG templating
- **Easy self-hosting** - Docker support and simple environment config

If the original works well for you, use it! This is just an alternative for those who want edge deployment or different tech choices.

## Attribution

This project is inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by Anurag Hazra.

## License

MIT
