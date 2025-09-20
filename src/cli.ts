#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import updateNotifier from 'update-notifier';
import { Formatter } from './utils/formatter';
import { searchCommand } from './commands/search';
import { detailsCommand } from './commands/details';
import { playlistCommand } from './commands/playlist';

const packageJson = require('../package.json');

// Check for updates
updateNotifier({ pkg: packageJson }).notify();

const program = new Command();

// CLI Header
console.log(figlet.textSync('YTSearch CLI', { horizontalLayout: 'full' }));
console.log(Formatter.createBrand());

program
  .name('ytsearch')
  .description('A beautiful command-line interface for YouTube search')
  .version(packageJson.version);

// Global options
program
  .option('-l, --limit <number>', 'limit number of results (default: 10)', '10')
  .option('-s, --sort <type>', 'sort by: relevance, upload_date, view_count, rating', 'relevance')
  .option('-j, --json', 'output raw JSON instead of formatted display', false);

// Video search command
program
  .command('video <query>')
  .description('search for YouTube videos')
  .action(async (query: string) => {
    await searchCommand(query, 'video', program.opts());
  });

// Channel search command
program
  .command('channel <query>')
  .description('search for YouTube channels')
  .action(async (query: string) => {
    await searchCommand(query, 'channel', program.opts());
  });

// Playlist search command
program
  .command('playlist <query>')
  .description('search for YouTube playlists')
  .action(async (query: string) => {
    await searchCommand(query, 'playlist', program.opts());
  });

// Video details command
program
  .command('details <videoId>')
  .description('get detailed information about a specific video')
  .action(async (videoId: string) => {
    await detailsCommand(videoId, program.opts());
  });

// Playlist videos command
program
  .command('playlist-videos <playlistId>')
  .description('get videos from a playlist with pagination')
  .action(async (playlistId: string) => {
    await playlistCommand(playlistId, program.opts());
  });

// Default search command (search all types)
program
  .command('search <query>')
  .description('search across all YouTube content types')
  .action(async (query: string) => {
    await searchCommand(query, undefined, program.opts());
  });

// Error handling
program.configureOutput({
  writeErr: (str) => process.stderr.write(Formatter.formatError(str))
});

program.parse();