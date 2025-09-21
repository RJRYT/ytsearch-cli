import inquirer from "inquirer";
import ora from "ora";
import { searchYouTube, getVideoDetails, getPlaylistItems } from "ytsearch.js";
import { Formatter } from "./utils/formatter";
import { DisplayMode, GlobalOptions } from "./types";
import chalk from "chalk";
import Table from "cli-table3";

export class InteractiveCLI {
  private defaultOptions: GlobalOptions = {
    limit: 10,
    sort: "relevance",
    mode: "default",
  };

  async start(): Promise<void> {
    console.clear();
    console.log(Formatter.createBrand());
    console.log(chalk.cyan("\n🚀 Welcome to Interactive YouTube Search CLI"));
    console.log(
      chalk.gray(
        "Use arrow keys to navigate, Enter to select, Ctrl+C to exit\n"
      )
    );

    while (true) {
      try {
        const action = await this.showMainMenu();

        if (action === "exit") {
          console.log(chalk.green("\n👋 Thanks for using YouTube Search CLI!"));
          break;
        }

        await this.handleAction(action);

        const { continueSearch } = await inquirer.prompt([
          {
            type: "confirm",
            name: "continueSearch",
            message: "Would you like to perform another search?",
            default: true,
          },
        ]);

        if (!continueSearch) {
          console.log(chalk.green("\n👋 Thanks for using YouTube Search CLI!"));
          break;
        }

        console.clear();
        console.log(Formatter.createBrand());
      } catch (error: any) {
        if (error.name === "ExitPromptError") {
          console.log(chalk.green("\n👋 Thanks for using YouTube Search CLI!"));
          break;
        }
        console.log(
          Formatter.formatError(`Interactive mode error: ${error.message}`)
        );
      }
    }
  }

  private async showMainMenu(): Promise<string> {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "🎥 Search Videos", value: "video" },
          { name: "📺 Search Channels", value: "channel" },
          { name: "📋 Search Playlists", value: "playlist" },
          { name: "🔍 Get Video Details", value: "details" },
          { name: "📚 Browse Playlist Videos", value: "playlist-videos" },
          { name: "🌐 Search All Types", value: "search-all" },
          new inquirer.Separator(),
          { name: "⚙️  Configure Settings", value: "settings" },
          { name: "❌ Exit", value: "exit" },
        ],
        pageSize: 15,
      },
    ]);

    return action;
  }

  private async handleAction(action: string): Promise<void> {
    switch (action) {
      case "video":
      case "channel":
      case "playlist":
      case "search-all":
        await this.handleSearch(
          action === "search-all" ? undefined : (action as any)
        );
        break;
      case "details":
        await this.handleVideoDetails();
        break;
      case "playlist-videos":
        await this.handlePlaylistVideos();
        break;
      case "settings":
        await this.handleSettings();
        break;
    }
  }

  private async handleSearch(
    type?: "video" | "channel" | "playlist"
  ): Promise<void> {
    const questions = [
      {
        type: "input",
        name: "query",
        message: `Enter your search query${type ? ` for ${type}s` : ""}:`,
        validate: (input: string) =>
          input.trim().length > 0 || "Please enter a search query",
      },
      {
        type: "list",
        name: "mode",
        message: "Select display mode:",
        choices: [
          { name: "📊 Default - Full tables with all info", value: "default" },
          { name: "🗜️  Compact - Quick table overview", value: "compact" },
          { name: "🌐 Online - URLs and clickable links", value: "online" },
          { name: "📋 Detailed - Extended metadata", value: "detailed" },
          { name: "📄 JSON - Raw JSON output", value: "json" },
        ],
        default: this.defaultOptions.mode,
      },
      {
        type: "number",
        name: "limit",
        message: "Number of results (1-50):",
        default: this.defaultOptions.limit,
        validate: (input: number) =>
          (input >= 1 && input <= 50) ||
          "Please enter a number between 1 and 50",
      },
      {
        type: "list",
        name: "sort",
        message: "Sort results by:",
        choices: [
          { name: "🎯 Relevance", value: "relevance" },
          { name: "📅 Upload Date", value: "upload_date" },
          { name: "👀 View Count", value: "view_count" },
          { name: "⭐ Rating", value: "rating" },
        ],
        default: this.defaultOptions.sort,
      },
    ];

    const answers = await inquirer.prompt(questions);

    const spinner = ora("Searching YouTube...").start();

    try {
      const searchOptions = {
        type: type,
        limit: answers.limit,
        sort: answers.sort,
      };

      // Remove undefined type to search all types
      if (!type) {
        delete searchOptions.type;
      }

      const results = await searchYouTube(answers.query, searchOptions);
      spinner.stop();

      console.log(
        Formatter.createHeader(`Search Results for "${answers.query}"`)
      );

      if (type) {
        console.log(
          Formatter.formatSuccess(`Found ${results.length} ${type}(s)`)
        );
      } else {
        console.log(
          Formatter.formatSuccess(`Found ${results.length} result(s)`)
        );
      }

      if (answers.mode === "json") {
        console.log(JSON.stringify(results, null, 2));
      } else {
        console.log(Formatter.formatResults(results, answers.mode));
      }

      if (results.length === 0) {
        console.log(
          Formatter.formatWarning(
            "Try different keywords or check your spelling"
          )
        );
      }
    } catch (error: any) {
      spinner.stop();

      if (error.name === "YtSearchError") {
        console.log(Formatter.formatError(`${error.code}: ${error.message}`));
        if (error.metadata) {
          console.log(
            Formatter.formatWarning(
              `Additional info: ${JSON.stringify(error.metadata)}`
            )
          );
        }
      } else {
        console.log(
          Formatter.formatError(`Unexpected error: ${error.message}`)
        );
      }
    }
  }

  private async handleVideoDetails(): Promise<void> {
    const { videoId } = await inquirer.prompt([
      {
        type: "input",
        name: "videoId",
        message: "Enter YouTube video ID or URL:",
        validate: (input: string) => {
          const trimmed = input.trim();
          if (trimmed.length === 0) return "Please enter a video ID or URL";

          // Extract video ID from URL if provided
          const urlMatch = trimmed.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
          );
          if (urlMatch || trimmed.length === 11) return true;

          return "Please enter a valid YouTube video ID or URL";
        },
        filter: (input: string) => {
          // Extract video ID from URL if provided
          const urlMatch = input.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
          );
          return urlMatch ? urlMatch[1] : input.trim();
        },
      },
    ]);

    const { mode } = await inquirer.prompt([
      {
        type: "list",
        name: "mode",
        message: "Display mode:",
        choices: [
          { name: "📊 Default - Standard details", value: "default" },
          { name: "📋 Detailed - Extended metadata", value: "detailed" },
          { name: "📄 JSON - Raw JSON output", value: "json" },
        ],
        default: "default",
      },
    ]);

    const spinner = ora("Fetching video details...").start();

    try {
      const details = await getVideoDetails(videoId);
      spinner.stop();

      console.log(Formatter.createHeader(`Video Details: ${details.title}`));

      if (mode === "json") {
        console.log(JSON.stringify(details, null, 2));
      } else {
        // Convert to our VideoResult format and display
        const videoResult = {
          type: "video" as const,
          id: details.id,
          title: details.title,
          image: details.thumbnail.url,
          thumbnail: details.thumbnail,
          viewCount: details.views,
          shortViewCount: details.viewsShort,
          duration: details.duration,
          seconds: 0, // Not available in details
          author: {
            name: details.channel.name,
            url: details.channel.url,
            verified: details.channel.verified,
          },
          watchUrl: details.watchUrl,
          publishedAt: details.uploadDate,
        };

        if (mode === "detailed") {
          console.log(Formatter.formatVideoDetailed(videoResult));
        } else {
          console.log(Formatter.formatVideo(videoResult));
        }
      }
    } catch (error: any) {
      spinner.stop();

      if (error.name === "YtSearchError") {
        console.log(Formatter.formatError(`${error.code}: ${error.message}`));
        if (error.code === "INVALID_VIDEO") {
          console.log(
            Formatter.formatWarning(
              "Please provide a valid YouTube video ID (e.g., dQw4w9WgXcQ)"
            )
          );
        }
      } else {
        console.log(
          Formatter.formatError(`Unexpected error: ${error.message}`)
        );
      }
    }
  }

  private async handlePlaylistVideos(): Promise<void> {
    const { playlistId } = await inquirer.prompt([
      {
        type: "input",
        name: "playlistId",
        message: "Enter YouTube playlist ID or URL:",
        validate: (input: string) => {
          const trimmed = input.trim();
          if (trimmed.length === 0) return "Please enter a playlist ID or URL";

          // Extract playlist ID from URL if provided
          const urlMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
          if (urlMatch || trimmed.length > 10) return true;

          return "Please enter a valid YouTube playlist ID or URL";
        },
        filter: (input: string) => {
          // Extract playlist ID from URL if provided
          const urlMatch = input.match(/[?&]list=([a-zA-Z0-9_-]+)/);
          return urlMatch ? urlMatch[1] : input.trim();
        },
      },
    ]);

    const { mode } = await inquirer.prompt([
      {
        type: "list",
        name: "mode",
        message: "Display mode:",
        choices: [
          {
            name: "📊 Interactive - Browse with pagination",
            value: "interactive",
          },
          { name: "📄 JSON - Raw JSON output", value: "json" },
        ],
        default: "interactive",
      },
    ]);

    const spinner = ora("Fetching playlist...").start();

    try {
      const playlistPage = await getPlaylistItems(playlistId);
      spinner.stop();

      if (mode === "json") {
        console.log(JSON.stringify(playlistPage, null, 2));
        return;
      }

      // Interactive mode similar to the original playlist command
      console.log(
        Formatter.createHeader(`Playlist: ${playlistPage.playlist.title}`)
      );

      let currentPage = playlistPage;
      let pageNumber = 1;

      while (true) {
        console.log(chalk.bold.cyan(`\n── Page ${pageNumber} ──`));

        // Display videos in a table format
        const videosTable = new Table({
          head: [
            chalk.bold.white("#"),
            chalk.bold.white("Title"),
            chalk.bold.white("Duration"),
            chalk.bold.white("Views"),
          ],
          chars: {
            top: "─",
            "top-mid": "┬",
            "top-left": "┌",
            "top-right": "┐",
            bottom: "─",
            "bottom-mid": "┴",
            "bottom-left": "└",
            "bottom-right": "┘",
            left: "│",
            "left-mid": "├",
            mid: "─",
            "mid-mid": "┼",
            right: "│",
            "right-mid": "┤",
            middle: "│",
          },
          colWidths: [5, 45, 12, 12],
          wordWrap: true,
        });

        currentPage.videos.forEach((video) => {
          const title =
            video.title.length > 40
              ? video.title.substring(0, 40) + "..."
              : video.title;
          videosTable.push([
            chalk.yellow(video.index),
            chalk.white(title),
            chalk.green(video.duration),
            chalk.magenta(video.views || "N/A"),
          ]);
        });

        console.log(videosTable.toString());

        // Check if there's a next page
        if (!currentPage.hasNextPage) {
          console.log(
            Formatter.formatSuccess(`Displayed all videos from the playlist`)
          );
          break;
        }

        // Ask user what to do next
        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
              { name: "➡️  Load next page", value: "next" },
              { name: "🏠 Return to main menu", value: "return" },
            ],
          },
        ]);

        if (action === "return") {
          break;
        }

        const nextSpinner = ora("Loading next page...").start();
        try {
          currentPage = (await currentPage.nextPage()) as any;
          nextSpinner.stop();
          pageNumber++;
        } catch (error) {
          nextSpinner.stop();
          console.log(Formatter.formatError("Failed to load next page"));
          break;
        }
      }
    } catch (error: any) {
      spinner.stop();

      if (error.name === "YtSearchError") {
        console.log(Formatter.formatError(`${error.code}: ${error.message}`));
        if (error.code === "INVALID_PLAYLIST") {
          console.log(
            Formatter.formatWarning(
              "Please provide a valid YouTube playlist ID"
            )
          );
        }
      } else {
        console.log(
          Formatter.formatError(`Unexpected error: ${error.message}`)
        );
      }
    }
  }

  private async handleSettings(): Promise<void> {
    const { setting } = await inquirer.prompt([
      {
        type: "list",
        name: "setting",
        message: "What would you like to configure?",
        choices: [
          { name: "📊 Default Display Mode", value: "mode" },
          { name: "🔢 Default Result Limit", value: "limit" },
          { name: "📈 Default Sort Method", value: "sort" },
          { name: "🔙 Back to Main Menu", value: "back" },
        ],
      },
    ]);

    if (setting === "back") return;

    switch (setting) {
      case "mode":
        const { newMode } = await inquirer.prompt([
          {
            type: "list",
            name: "newMode",
            message: "Select default display mode:",
            choices: [
              { name: "📊 Default - Full tables", value: "default" },
              { name: "🗜️  Compact - Quick overview", value: "compact" },
              { name: "🌐 Online - URLs and links", value: "online" },
              { name: "📋 Detailed - Extended metadata", value: "detailed" },
            ],
            default: this.defaultOptions.mode,
          },
        ]);
        this.defaultOptions.mode = newMode;
        console.log(
          Formatter.formatSuccess(`Default display mode set to: ${newMode}`)
        );
        break;

      case "limit":
        const { newLimit } = await inquirer.prompt([
          {
            type: "number",
            name: "newLimit",
            message: "Default number of results (1-50):",
            default: this.defaultOptions.limit,
            validate: (input: number) =>
              (input >= 1 && input <= 50) ||
              "Please enter a number between 1 and 50",
          },
        ]);
        this.defaultOptions.limit = newLimit;
        console.log(
          Formatter.formatSuccess(`Default result limit set to: ${newLimit}`)
        );
        break;

      case "sort":
        const { newSort } = await inquirer.prompt([
          {
            type: "list",
            name: "newSort",
            message: "Default sort method:",
            choices: [
              { name: "🎯 Relevance", value: "relevance" },
              { name: "📅 Upload Date", value: "upload_date" },
              { name: "👀 View Count", value: "view_count" },
              { name: "⭐ Rating", value: "rating" },
            ],
            default: this.defaultOptions.sort,
          },
        ]);
        this.defaultOptions.sort = newSort;
        console.log(
          Formatter.formatSuccess(`Default sort method set to: ${newSort}`)
        );
        break;
    }
  }
}
