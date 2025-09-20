import ora from 'ora';
import inquirer from 'inquirer';
import { getPlaylistItems } from 'ytsearch.js';
import { Formatter } from '../utils/formatter';
import { GlobalOptions } from '../types';
import Table from 'cli-table3';
import chalk from 'chalk';

export async function playlistCommand(playlistId: string, options: GlobalOptions = {}): Promise<void> {
  const spinner = ora('Fetching playlist...').start();
  
  try {
    const playlistPage = await getPlaylistItems(playlistId);
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(playlistPage, null, 2));
      return;
    }

    // Display playlist info
    console.log(Formatter.createHeader(`Playlist: ${playlistPage.playlist.title}`));
    
    const infoTable = new Table({
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

    const verifiedIcon = playlistPage.playlist.author.verified ? chalk.blue('✓') : '';
    const artistIcon = playlistPage.playlist.author.isArtist ? chalk.red('♪') : '';

    infoTable.push(
      [chalk.bold.yellow('Author'), `${chalk.cyan(playlistPage.playlist.author.name)} ${verifiedIcon} ${artistIcon}`],
      [chalk.bold.yellow('Total Videos'), chalk.green(playlistPage.playlist.videoCount)],
      [chalk.bold.yellow('Total Views'), chalk.magenta(playlistPage.playlist.viewsCount || 'N/A')],
      [chalk.bold.yellow('Expected Pages'), chalk.blue(playlistPage.playlist.expectedPages?.toString() || 'Unknown')]
    );

    if (playlistPage.playlist.description) {
      const shortDesc = playlistPage.playlist.description.length > 200 
        ? playlistPage.playlist.description.substring(0, 200) + '...' 
        : playlistPage.playlist.description;
      infoTable.push([chalk.bold.yellow('Description'), chalk.gray(shortDesc)]);
    }

    console.log(infoTable.toString());

    // Display videos
    let currentPage = playlistPage;
    let pageNumber = 1;

    while (true) {
      console.log(chalk.bold.cyan(`\n── Page ${pageNumber} ──`));
      
      const videosTable = new Table({
        head: [
          chalk.bold.white('#'),
          chalk.bold.white('Title'),
          chalk.bold.white('Duration'),
          chalk.bold.white('Views')
        ],
        chars: {
          'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
          'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
          'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
          'right': '│', 'right-mid': '┤', 'middle': '│'
        },
        colWidths: [5, 45, 12, 12],
        wordWrap: true
      });

      currentPage.videos.forEach((video) => {
        const title = video.title.length > 40 ? video.title.substring(0, 40) + '...' : video.title;
        videosTable.push([
          chalk.yellow(video.index),
          chalk.white(title),
          chalk.green(video.duration),
          chalk.magenta(video.views || 'N/A')
        ]);
      });

      console.log(videosTable.toString());

      // Check if there's a next page
      if (!currentPage.hasNextPage) {
        console.log(Formatter.formatSuccess(`Displayed all ${currentPage.videos.length} videos from the playlist`));
        break;
      }

      // Ask user if they want to see the next page
      const { loadMore } = await inquirer.prompt([{
        type: 'confirm',
        name: 'loadMore',
        message: 'Load next page?',
        default: false
      }]);

      if (!loadMore) {
        break;
      }

      const nextSpinner = ora('Loading next page...').start();
      try {
        currentPage = await currentPage.nextPage() as any;
        nextSpinner.stop();
        pageNumber++;
      } catch (error) {
        nextSpinner.stop();
        console.log(Formatter.formatError('Failed to load next page'));
        break;
      }
    }

  } catch (error: any) {
    spinner.stop();
    
    if (error.name === 'YtSearchError') {
      console.log(Formatter.formatError(`${error.code}: ${error.message}`));
      if (error.code === 'INVALID_PLAYLIST') {
        console.log(Formatter.formatWarning('Please provide a valid YouTube playlist ID (e.g., PL4QNnZJr8sRPEJPqe7jZnsLPTBu1E3nIY)'));
      }
    } else {
      console.log(Formatter.formatError(`Unexpected error: ${error.message}`));
    }
    
    process.exit(1);
  }
}