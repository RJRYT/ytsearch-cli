# Overview

This is a command-line interface (CLI) application for searching YouTube content. Built with TypeScript and Node.js, it provides a beautiful terminal interface for searching videos, channels, and playlists using the `ytsearch.js` library. The CLI features rich formatting, interactive prompts, and multiple output formats including JSON and formatted tables.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### CLI Framework

The application uses **Commander.js** as the primary CLI framework to handle command parsing and option management. This provides a clean, structured approach to building command-line interfaces with support for subcommands, global options, and help generation.

### Core Commands Structure

The CLI is organized around three main command types:

- **Video search** - Search for YouTube videos with metadata like views, duration, and author
- **Channel search** - Find YouTube channels with subscriber counts and verification status
- **Playlist search** - Discover playlists with video counts and author information

Additional utility commands include:

- **Details command** - Fetch detailed information about specific videos
- **Playlist command** - Browse playlist contents and metadata

### Terminal User Interface

The application heavily emphasizes visual presentation using several UI libraries:

- **Figlet** for ASCII art headers and branding
- **Chalk** for colored terminal output with semantic color coding
- **Boxen** for creating bordered content boxes
- **CLI-table3** for structured data display in table format
- **Ora** for loading spinners during API calls
- **Inquirer** for interactive prompts and user input

### Output Formatting

The system supports dual output modes:

- **Formatted display** - Rich terminal formatting with tables, colors, and icons for human readability
- **JSON output** - Raw JSON data for programmatic consumption and scripting

### TypeScript Architecture

The codebase is fully typed with TypeScript, using:

- **Strict mode** enabled for enhanced type safety
- **CommonJS modules** for Node.js compatibility
- **Interface definitions** for search results, options, and command parameters
- **Declaration files** generated for potential library usage

### Build and Distribution

The project uses a standard TypeScript build pipeline:

- **Source code** in `src/` directory
- **Compiled output** in `dist/` directory
- **Binary executable** configured for npm global installation
- **Development mode** with watch compilation for rapid iteration

## External Dependencies

### Core YouTube Integration

- **ytsearch.js** - Primary library for YouTube search functionality and data retrieval

### CLI Development Stack

- **commander** - Command-line interface framework for argument parsing
- **inquirer** - Interactive command-line prompts and user input
- **open** - Cross-platform utility for opening URLs in default browser

### Terminal Enhancement Libraries

- **chalk** - Terminal string styling with colors and formatting
- **boxen** - Terminal box creation for headers and content sections
- **cli-table3** - ASCII table generation for structured data display
- **figlet** - ASCII art text generation for branding
- **ora** - Elegant terminal spinners for loading states

### Utility Services

- **update-notifier** - Automatic update checking and user notifications for new versions
