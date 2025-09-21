import ora from "ora";
import { searchYouTube } from "ytsearch.js";
import { Formatter } from "../utils/formatter";
import { GlobalOptions } from "../types";

export async function searchCommand(
  query: string,
  type?: "video" | "channel" | "playlist",
  options: GlobalOptions = {}
): Promise<void> {
  const spinner = ora("Searching YouTube...").start();

  try {
    const searchOptions = {
      type: type,
      limit: parseInt(options.limit?.toString() || "10"),
      sort: options.sort || "relevance",
    };

    // Remove undefined type to search all types
    if (!type) {
      delete searchOptions.type;
    }

    const results = await searchYouTube(query, searchOptions);
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    console.log(Formatter.createHeader(`Search Results for "${query}"`));

    if (type) {
      console.log(
        Formatter.formatSuccess(`Found ${results.length} ${type}(s)`)
      );
    } else {
      console.log(Formatter.formatSuccess(`Found ${results.length} result(s)`));
    }

    console.log(Formatter.formatResults(results, options.mode));

    if (results.length === 0) {
      console.log(
        Formatter.formatWarning("Try different keywords or check your spelling")
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
      console.log(Formatter.formatError(`Unexpected error: ${error.message}`));
    }

    process.exit(1);
  }
}
