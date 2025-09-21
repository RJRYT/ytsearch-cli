import chalk from "chalk";
import boxen from "boxen";
import Table from "cli-table3";
import {
  VideoResult,
  ChannelResult,
  PlaylistResult,
  SearchResult,
  DisplayMode,
} from "../types";

export class Formatter {
  static createHeader(title: string): string {
    return boxen(chalk.bold.cyan(title), {
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: "cyan",
    });
  }

  static createBrand(): string {
    return chalk.cyan("🎥 ") + chalk.magenta("YouTube Search CLI");
  }

  static formatVideo(video: VideoResult): string {
    const table = new Table({
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
      style: { head: [], border: [] },
      colWidths: [15, 65],
      wordWrap: true,
    });

    const verifiedIcon = video.author?.verified ? chalk.blue("✓") : "";

    table.push(
      [chalk.bold.yellow("Title"), chalk.white(video.title)],
      [
        chalk.bold.yellow("Author"),
        `${chalk.cyan(video.author?.name || "Unknown")} ${verifiedIcon}`,
      ],
      [chalk.bold.yellow("Duration"), chalk.green(video.duration)],
      [chalk.bold.yellow("Views"), chalk.magenta(video.shortViewCount)],
      [chalk.bold.yellow("Published"), chalk.gray(video.publishedAt)],
      [chalk.bold.yellow("Watch URL"), chalk.underline.blue(video.watchUrl)]
    );

    return table.toString();
  }

  static formatChannel(channel: ChannelResult): string {
    const table = new Table({
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
      style: { head: [], border: [] },
      colWidths: [15, 65],
      wordWrap: true,
    });

    const verifiedIcon = channel.verified ? chalk.blue("✓") : "";
    const artistIcon = channel.isArtist ? chalk.red("♪") : "";

    table.push(
      [
        chalk.bold.yellow("Channel"),
        `${chalk.white(channel.title)} ${verifiedIcon} ${artistIcon}`,
      ],
      [
        chalk.bold.yellow("Subscribers"),
        chalk.magenta(channel.subscriberCount),
      ],
      [
        chalk.bold.yellow("Description"),
        chalk.gray(channel.description || "No description"),
      ],
      [chalk.bold.yellow("URL"), chalk.underline.blue(channel.url)]
    );

    return table.toString();
  }

  static formatPlaylist(playlist: PlaylistResult): string {
    const table = new Table({
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
      style: { head: [], border: [] },
      colWidths: [15, 65],
      wordWrap: true,
    });

    const verifiedIcon = playlist.author?.verified ? chalk.blue("✓") : "";
    const artistIcon = playlist.author?.isArtist ? chalk.red("♪") : "";

    table.push(
      [chalk.bold.yellow("Playlist"), chalk.white(playlist.title)],
      [
        chalk.bold.yellow("Author"),
        `${chalk.cyan(
          playlist.author?.name || "Unknown"
        )} ${verifiedIcon} ${artistIcon}`,
      ],
      [
        chalk.bold.yellow("Videos"),
        chalk.green(playlist.videoCount.toString()),
      ],
      [chalk.bold.yellow("URL"), chalk.underline.blue(playlist.url)]
    );

    return table.toString();
  }

  static formatResults(
    results: SearchResult[],
    mode: DisplayMode = "default"
  ): string {
    if (results.length === 0) {
      return boxen(chalk.yellow("No results found"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "yellow",
      });
    }

    if (mode === "compact") {
      return this.formatCompactResults(results);
    } else if (mode === "online") {
      return this.formatOnlineResults(results);
    }

    let output = "";
    results.forEach((result, index) => {
      output += chalk.bold.cyan(`\n── Result ${index + 1} ──\n`);

      switch (result.type) {
        case "video":
          output += this.formatVideoByMode(result, mode);
          break;
        case "channel":
          output += this.formatChannelByMode(result, mode);
          break;
        case "playlist":
          output += this.formatPlaylistByMode(result, mode);
          break;
      }
      output += "\n";
    });

    return output;
  }

  // Format methods by mode
  static formatVideoByMode(video: VideoResult, mode: DisplayMode): string {
    switch (mode) {
      case "detailed":
        return this.formatVideoDetailed(video);
      case "default":
      default:
        return this.formatVideo(video);
    }
  }

  static formatChannelByMode(
    channel: ChannelResult,
    mode: DisplayMode
  ): string {
    switch (mode) {
      case "detailed":
        return this.formatChannelDetailed(channel);
      case "default":
      default:
        return this.formatChannel(channel);
    }
  }

  static formatPlaylistByMode(
    playlist: PlaylistResult,
    mode: DisplayMode
  ): string {
    switch (mode) {
      case "detailed":
        return this.formatPlaylistDetailed(playlist);
      case "default":
      default:
        return this.formatPlaylist(playlist);
    }
  }

  // Compact mode formatter
  static formatCompactResults(results: SearchResult[]): string {
    const table = new Table({
      head: [
        chalk.bold.white("Type"),
        chalk.bold.white("Title"),
        chalk.bold.white("Author"),
        chalk.bold.white("Info"),
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
      colWidths: [8, 40, 20, 20],
      wordWrap: true,
    });

    results.forEach((result) => {
      const title =
        result.title.length > 35
          ? result.title.substring(0, 35) + "..."
          : result.title;

      switch (result.type) {
        case "video":
          const authorName = result.author?.name || "Unknown";
          const shortAuthor =
            authorName.length > 15
              ? authorName.substring(0, 15) + "..."
              : authorName;
          const verifiedIcon = result.author?.verified ? chalk.blue("✓") : "";
          table.push([
            chalk.red("📹 VID"),
            chalk.white(title),
            `${chalk.cyan(shortAuthor)} ${verifiedIcon}`,
            chalk.green(result.duration) +
              " " +
              chalk.magenta(result.shortViewCount),
          ]);
          break;
        case "channel":
          const channelVerified = result.verified ? chalk.blue("✓") : "";
          const artistIcon = result.isArtist ? chalk.red("♪") : "";
          table.push([
            chalk.blue("📺 CHAN"),
            chalk.white(title),
            `${channelVerified} ${artistIcon}`,
            chalk.magenta(result.subscriberCount),
          ]);
          break;
        case "playlist":
          const playlistAuthor = result.author?.name || "Unknown";
          const shortPlaylistAuthor =
            playlistAuthor.length > 15
              ? playlistAuthor.substring(0, 15) + "..."
              : playlistAuthor;
          table.push([
            chalk.green("📋 PLAY"),
            chalk.white(title),
            chalk.cyan(shortPlaylistAuthor),
            chalk.green(result.videoCount + " videos"),
          ]);
          break;
      }
    });

    return table.toString();
  }

  // Online mode formatter
  static formatOnlineResults(results: SearchResult[]): string {
    let output = "\n";

    results.forEach((result, index) => {
      output += chalk.bold.cyan(`${index + 1}. `);

      switch (result.type) {
        case "video":
          output += chalk.white(result.title) + "\n";
          output +=
            chalk.gray("   🎬 ") + chalk.cyan(result.author?.name || "Unknown");
          if (result.author?.verified) output += chalk.blue(" ✓");
          output +=
            chalk.gray(" • ") +
            chalk.green(result.duration) +
            chalk.gray(" • ") +
            chalk.magenta(result.shortViewCount) +
            "\n";
          output +=
            chalk.gray("   📺 ") +
            chalk.underline.blue(result.watchUrl) +
            "\n\n";
          break;
        case "channel":
          output += chalk.white(result.title) + "\n";
          output += chalk.gray("   📺 ");
          if (result.verified) output += chalk.blue("✓ ");
          if (result.isArtist) output += chalk.red("♪ ");
          output += chalk.magenta(result.subscriberCount) + " subscribers\n";
          output +=
            chalk.gray("   🔗 ") + chalk.underline.blue(result.url) + "\n\n";
          break;
        case "playlist":
          output += chalk.white(result.title) + "\n";
          output +=
            chalk.gray("   👤 ") + chalk.cyan(result.author?.name || "Unknown");
          if (result.author?.verified) output += chalk.blue(" ✓");
          if (result.author?.isArtist) output += chalk.red(" ♪");
          output +=
            chalk.gray(" • ") +
            chalk.green(result.videoCount + " videos") +
            "\n";
          output +=
            chalk.gray("   📋 ") + chalk.underline.blue(result.url) + "\n\n";
          break;
      }
    });

    return output;
  }

  static formatError(error: string): string {
    return boxen(chalk.red.bold(`❌ Error: ${error}`), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "red",
    });
  }

  static formatSuccess(message: string): string {
    return boxen(chalk.green.bold(`✅ ${message}`), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
    });
  }

  static formatWarning(message: string): string {
    return boxen(chalk.yellow.bold(`⚠️  ${message}`), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "yellow",
    });
  }

  // Detailed formatters
  static formatVideoDetailed(video: VideoResult): string {
    const table = new Table({
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
      style: { head: [], border: [] },
      colWidths: [18, 62],
      wordWrap: true,
    });

    const verifiedIcon = video.author?.verified
      ? chalk.blue("✓ Verified")
      : chalk.gray("Not Verified");

    table.push(
      [chalk.bold.yellow("Video Title"), chalk.white(video.title)],
      [chalk.bold.yellow("Video ID"), chalk.gray(video.id)],
      [
        chalk.bold.yellow("Author"),
        `${chalk.cyan(video.author?.name || "Unknown")} (${verifiedIcon})`,
      ],
      [
        chalk.bold.yellow("Author URL"),
        chalk.underline.blue(video.author?.url || "N/A"),
      ],
      [
        chalk.bold.yellow("Duration"),
        `${chalk.green(video.duration)} (${chalk.gray(video.seconds + "s")})`,
      ],
      [
        chalk.bold.yellow("Views (Raw)"),
        chalk.magenta(video.viewCount.toLocaleString()),
      ],
      [chalk.bold.yellow("Views (Short)"), chalk.magenta(video.shortViewCount)],
      [chalk.bold.yellow("Published"), chalk.gray(video.publishedAt)],
      [
        chalk.bold.yellow("Thumbnail"),
        chalk.underline.blue(video.thumbnail.url),
      ],
      [
        chalk.bold.yellow("Resolution"),
        chalk.green(`${video.thumbnail.width}x${video.thumbnail.height}`),
      ],
      [chalk.bold.yellow("Watch URL"), chalk.underline.blue(video.watchUrl)]
    );

    return table.toString();
  }

  static formatChannelDetailed(channel: ChannelResult): string {
    const table = new Table({
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
      style: { head: [], border: [] },
      colWidths: [18, 62],
      wordWrap: true,
    });

    const verifiedStatus = channel.verified
      ? chalk.blue("✓ Verified")
      : chalk.gray("Not Verified");
    const artistStatus = channel.isArtist
      ? chalk.red("♪ Artist Channel")
      : chalk.gray("Regular Channel");

    table.push(
      [chalk.bold.yellow("Channel Name"), chalk.white(channel.title)],
      [chalk.bold.yellow("Channel ID"), chalk.gray(channel.id)],
      [chalk.bold.yellow("Verification"), verifiedStatus],
      [chalk.bold.yellow("Channel Type"), artistStatus],
      [
        chalk.bold.yellow("Subscribers"),
        chalk.magenta(channel.subscriberCount),
      ],
      [
        chalk.bold.yellow("Description"),
        chalk.gray(channel.description || "No description available"),
      ],
      [
        chalk.bold.yellow("Avatar"),
        chalk.underline.blue(channel.thumbnail.url),
      ],
      [
        chalk.bold.yellow("Avatar Size"),
        chalk.green(`${channel.thumbnail.width}x${channel.thumbnail.height}`),
      ],
      [chalk.bold.yellow("Channel URL"), chalk.underline.blue(channel.url)]
    );

    return table.toString();
  }

  static formatPlaylistDetailed(playlist: PlaylistResult): string {
    const table = new Table({
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
      style: { head: [], border: [] },
      colWidths: [18, 62],
      wordWrap: true,
    });

    const verifiedIcon = playlist.author?.verified
      ? chalk.blue("✓ Verified")
      : chalk.gray("Not Verified");
    const artistIcon = playlist.author?.isArtist
      ? chalk.red("♪ Artist")
      : chalk.gray("Regular User");

    table.push(
      [chalk.bold.yellow("Playlist Title"), chalk.white(playlist.title)],
      [chalk.bold.yellow("Playlist ID"), chalk.gray(playlist.id)],
      [chalk.bold.yellow("Content Type"), chalk.cyan(playlist.contentType)],
      [
        chalk.bold.yellow("Video Count"),
        chalk.green(playlist.videoCount.toString()),
      ],
      [
        chalk.bold.yellow("Author"),
        `${chalk.cyan(playlist.author?.name || "Unknown")}`,
      ],
      [chalk.bold.yellow("Author Status"), `${verifiedIcon} • ${artistIcon}`],
      [
        chalk.bold.yellow("Author URL"),
        chalk.underline.blue(playlist.author?.url || "N/A"),
      ],
      [
        chalk.bold.yellow("Thumbnail"),
        chalk.underline.blue(playlist.thumbnail.url),
      ],
      [
        chalk.bold.yellow("Thumb Size"),
        chalk.green(`${playlist.thumbnail.width}x${playlist.thumbnail.height}`),
      ],
      [chalk.bold.yellow("Playlist URL"), chalk.underline.blue(playlist.url)]
    );

    return table.toString();
  }
}
