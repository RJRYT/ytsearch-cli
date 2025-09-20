import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import { VideoResult, ChannelResult, PlaylistResult, SearchResult } from '../types';

export class Formatter {
  static createHeader(title: string): string {
    return boxen(chalk.bold.cyan(title), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan'
    });
  }

  static createBrand(): string {
    return chalk.cyan('🎥 ') + chalk.magenta('YouTube Search CLI');
  }

  static formatVideo(video: VideoResult): string {
    const table = new Table({
      chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      style: { head: [], border: [] },
      colWidths: [15, 65],
      wordWrap: true
    });

    const verifiedIcon = video.author?.verified ? chalk.blue('✓') : '';
    
    table.push(
      [chalk.bold.yellow('Title'), chalk.white(video.title)],
      [chalk.bold.yellow('Author'), `${chalk.cyan(video.author?.name || 'Unknown')} ${verifiedIcon}`],
      [chalk.bold.yellow('Duration'), chalk.green(video.duration)],
      [chalk.bold.yellow('Views'), chalk.magenta(video.shortViewCount)],
      [chalk.bold.yellow('Published'), chalk.gray(video.publishedAt)],
      [chalk.bold.yellow('Watch URL'), chalk.underline.blue(video.watchUrl)]
    );

    return table.toString();
  }

  static formatChannel(channel: ChannelResult): string {
    const table = new Table({
      chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      style: { head: [], border: [] },
      colWidths: [15, 65],
      wordWrap: true
    });

    const verifiedIcon = channel.verified ? chalk.blue('✓') : '';
    const artistIcon = channel.isArtist ? chalk.red('♪') : '';
    
    table.push(
      [chalk.bold.yellow('Channel'), `${chalk.white(channel.title)} ${verifiedIcon} ${artistIcon}`],
      [chalk.bold.yellow('Subscribers'), chalk.magenta(channel.subscriberCount)],
      [chalk.bold.yellow('Description'), chalk.gray(channel.description || 'No description')],
      [chalk.bold.yellow('URL'), chalk.underline.blue(channel.url)]
    );

    return table.toString();
  }

  static formatPlaylist(playlist: PlaylistResult): string {
    const table = new Table({
      chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      style: { head: [], border: [] },
      colWidths: [15, 65],
      wordWrap: true
    });

    const verifiedIcon = playlist.author?.verified ? chalk.blue('✓') : '';
    const artistIcon = playlist.author?.isArtist ? chalk.red('♪') : '';
    
    table.push(
      [chalk.bold.yellow('Playlist'), chalk.white(playlist.title)],
      [chalk.bold.yellow('Author'), `${chalk.cyan(playlist.author?.name || 'Unknown')} ${verifiedIcon} ${artistIcon}`],
      [chalk.bold.yellow('Videos'), chalk.green(playlist.videoCount.toString())],
      [chalk.bold.yellow('URL'), chalk.underline.blue(playlist.url)]
    );

    return table.toString();
  }

  static formatResults(results: SearchResult[]): string {
    if (results.length === 0) {
      return boxen(chalk.yellow('No results found'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'yellow'
      });
    }

    let output = '';
    results.forEach((result, index) => {
      output += chalk.bold.cyan(`\n── Result ${index + 1} ──\n`);
      
      switch (result.type) {
        case 'video':
          output += this.formatVideo(result);
          break;
        case 'channel':
          output += this.formatChannel(result);
          break;
        case 'playlist':
          output += this.formatPlaylist(result);
          break;
      }
      output += '\n';
    });

    return output;
  }

  static formatError(error: string): string {
    return boxen(chalk.red.bold(`❌ Error: ${error}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red'
    });
  }

  static formatSuccess(message: string): string {
    return boxen(chalk.green.bold(`✅ ${message}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green'
    });
  }

  static formatWarning(message: string): string {
    return boxen(chalk.yellow.bold(`⚠️  ${message}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'yellow'
    });
  }
}