# YTSearch CLI

A simple command-line tool for searching YouTube, powered by the [`ytsearch.js`](https://www.npmjs.com/package/ytsearch.js) library. It lets you search for videos, channels, and playlists directly from your terminal with clean formatting and multiple display modes.

---

## 🚀 Installation

```bash
npm install -g ytsearch-cli
```

Run help:

```bash
ytsearch --help
```

---

## 📖 Usage

### Video Search

```bash
ytsearch video "never gonna give you up"
```

### Channel Search

```bash
ytsearch channel "RickAstleyVEVO"
```

### Playlist Search

```bash
ytsearch playlist "Top Hits 2025"
```

### Video Details

```bash
ytsearch details <videoId>
```

### Playlist Videos

```bash
ytsearch playlist-videos <playlistId>
```

### Search All Types

```bash
ytsearch search "lofi hip hop"
```

---

## ⚙️ Options

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

## 🎛 Display Modes

* **default** → Rich tables with info
* **compact** → Minimal quick view
* **online** → Clickable links
* **detailed** → Full metadata

---

## 👨‍💻 Interactive Mode

Run:

```bash
ytsearch --watch
```

Features:

* Arrow key navigation
* Continuous search
* Live settings update

---

## 📦 Tech Used

* [ytsearch.js](https://www.npmjs.com/package/ytsearch.js) – Core YouTube search engine
* [commander](https://www.npmjs.com/package/commander) – CLI framework
* [inquirer](https://www.npmjs.com/package/inquirer) – Interactive prompts
* [chalk](https://www.npmjs.com/package/chalk) – Colors and styling
* [figlet](https://www.npmjs.com/package/figlet) – ASCII art banner
* [cli-table3](https://www.npmjs.com/package/cli-table3) – Pretty terminal tables
* [ora](https://www.npmjs.com/package/ora) – Loading spinners
* [update-notifier](https://www.npmjs.com/package/update-notifier) – Update notifications

---

## 📝 License

MIT License © 2025
