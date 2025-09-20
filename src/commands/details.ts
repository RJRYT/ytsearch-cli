import ora from 'ora';
import { getVideoDetails } from 'ytsearch.js';
import { Formatter } from '../utils/formatter';
import { GlobalOptions } from '../types';
import Table from 'cli-table3';
import chalk from 'chalk';

export async function detailsCommand(videoId: string, options: GlobalOptions = {}): Promise<void> {
  const spinner = ora('Fetching video details...').start();
  
  try {
    const details = await getVideoDetails(videoId);
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(details, null, 2));
      return;
    }

    console.log(Formatter.createHeader(`Video Details: ${details.title}`));

    const table = new Table({
      chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      style: { head: [], border: [] },
      colWidths: [20, 60],
      wordWrap: true
    });

    const verifiedIcon = details.channel.verified ? chalk.blue('✓') : '';
    const artistIcon = details.channel.isArtist ? chalk.red('♪') : '';
    const liveIcon = details.isLive ? chalk.red('🔴 LIVE') : '';
    const privateIcon = details.isPrivate ? chalk.yellow('🔒 PRIVATE') : '';
    const unlistedIcon = details.isUnlisted ? chalk.gray('👁️ UNLISTED') : '';

    table.push(
      [chalk.bold.yellow('Title'), `${chalk.white(details.title)} ${liveIcon} ${privateIcon} ${unlistedIcon}`],
      [chalk.bold.yellow('Channel'), `${chalk.cyan(details.channel.name)} ${verifiedIcon} ${artistIcon}`],
      [chalk.bold.yellow('Subscribers'), chalk.magenta(details.channel.subscribers || 'N/A')],
      [chalk.bold.yellow('Duration'), chalk.green(details.duration)],
      [chalk.bold.yellow('Views'), chalk.magenta(details.viewsShort)],
      [chalk.bold.yellow('Likes'), chalk.red(details.likesShort || 'N/A')],
      [chalk.bold.yellow('Upload Date'), chalk.gray(details.uploadDate)],
      [chalk.bold.yellow('Category'), chalk.cyan(details.category || 'N/A')],
      [chalk.bold.yellow('Ratings Allowed'), details.allowRatings ? chalk.green('Yes') : chalk.red('No')],
      [chalk.bold.yellow('Watch URL'), chalk.underline.blue(details.watchUrl)]
    );

    if (details.description && details.description.length > 0) {
      const shortDesc = details.description.length > 200 
        ? details.description.substring(0, 200) + '...' 
        : details.description;
      table.push([chalk.bold.yellow('Description'), chalk.gray(shortDesc)]);
    }

    console.log(table.toString());

  } catch (error: any) {
    spinner.stop();
    
    if (error.name === 'YtSearchError') {
      console.log(Formatter.formatError(`${error.code}: ${error.message}`));
      if (error.code === 'INVALID_VIDEO') {
        console.log(Formatter.formatWarning('Please provide a valid YouTube video ID (e.g., dQw4w9WgXcQ)'));
      }
    } else {
      console.log(Formatter.formatError(`Unexpected error: ${error.message}`));
    }
    
    process.exit(1);
  }
}