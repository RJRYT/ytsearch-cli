# YTSearch CLI — YouTube Search from the Terminal

**YTSearch CLI** is a Node.js command-line tool for searching YouTube directly from your terminal. Search YouTube videos, channels, playlists, video details, and playlist videos with formatted output, JSON support, and an interactive mode.

Built with [ytsearch.js](https://www.npmjs.com/package/ytsearch.js).

## Install YTSearch CLI

Install the YouTube search CLI globally with npm:

```bash
npm install -g ytsearch-cli
```

Run help:

```bash
ytsearch --help
```

---

## Features

- Search YouTube videos, channels, and playlists from the command line
- Retrieve YouTube video details and playlist videos by ID
- Choose rich table, compact, detailed, or link-friendly output
- Export search results as JSON for scripts and automation
- Use interactive watch mode for repeated searches
- Works with Node.js 14 and later

---

## YouTube Search CLI Usage

### Search YouTube Videos

```bash
ytsearch video "never gonna give you up"
```

### Search YouTube Channels

```bash
ytsearch channel "RickAstleyVEVO"
```

### Search YouTube Playlists

```bash
ytsearch playlist "Top Hits 2026"
```

### Get YouTube Video Details

```bash
ytsearch details <videoId>
```

### Get Videos from a YouTube Playlist

```bash
ytsearch playlist-videos <playlistId>
```

### Search All Types

```bash
ytsearch search "lofi hip hop"
```

---

## CLI Options

* `-l, --limit <n>` → Number of results (default: `10`)
* `-s, --sort <type>` → `relevance`, `upload_date`, `view_count`, `rating`
* `-m, --mode <type>` → `default`, `compact`, `online`, `detailed`
* `-j, --json` → Output raw JSON
* `-w, --watch` → Interactive mode

Example:

```bash
ytsearch video "javascript tutorial" -l 5 -m compact
```

---

## Display Modes

* **default** → Rich tables with info
* **compact** → Minimal quick view
* **online** → Clickable links
* **detailed** → Full metadata

---

## Interactive YouTube Search Mode

Run:

```bash
ytsearch --watch
```

Features:

* Arrow key navigation
* Continuous search
* Live settings update

---

## Tech Used

* [ytsearch.js](https://www.npmjs.com/package/ytsearch.js) – Core YouTube search engine
* [commander](https://www.npmjs.com/package/commander) – CLI framework
* [inquirer](https://www.npmjs.com/package/inquirer) – Interactive prompts
* [chalk](https://www.npmjs.com/package/chalk) – Colors and styling
* [figlet](https://www.npmjs.com/package/figlet) – ASCII art banner
* [cli-table3](https://www.npmjs.com/package/cli-table3) – Pretty terminal tables
* [ora](https://www.npmjs.com/package/ora) – Loading spinners
* [update-notifier](https://www.npmjs.com/package/update-notifier) – Update notifications

---

## License

MIT License © 2026
