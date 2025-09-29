import ora from "ora";
import { searchYouTube, SearchType, SearchResult } from "ytsearch.js";
import { Formatter } from "../utils/formatter";
import { GlobalOptions } from "../types";
import inquirer from "inquirer";

export async function searchCommand(
  query: string,
  type?: SearchType,
  options: GlobalOptions = {}
): Promise<void> {
  const spinner = ora("Searching YouTube...").start();

  try {
    const searchOptions = {
      type: type,
      limit: parseInt(options.limit?.toString() || "10"),
      sort: options.sort || "relevance",
    };

    const results = await searchYouTube(query, searchOptions);
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    console.log(Formatter.createHeader(`Search Results for "${query}"`));

    let currentPage: SearchResult | null = results;
    let pageNumber = 1;

    while (true) {
      if (!currentPage) {
        console.log(Formatter.formatWarning("No results found."));
        break;
      }

      const totalResults =
        currentPage.channels.length +
        currentPage.playlists.length +
        currentPage.videos.length +
        currentPage.movies.length +
        currentPage.lives.length;

      if(totalResults === 0) {
        console.log(Formatter.formatWarning("No results found."));
        break;
      }

      console.log(Formatter.createHeader(`Page ${pageNumber}`));

      if (type && type !== "any") {
        console.log(
          Formatter.formatSuccess(`Found ${totalResults} ${type}(s)`)
        );
      } else {
        console.log(Formatter.formatSuccess(`Found ${totalResults} result(s)`));
      }

      console.log(Formatter.formatResults(currentPage, options.mode));

      // Check if there's a next page
      if (!currentPage.metadata.hasNextPage) {
        console.log(
          Formatter.formatSuccess(
            `Displayed all ${currentPage.videos.length} result from the youtube search`
          )
        );
        break;
      }

      // Ask user if they want to see the next page
      const { loadMore } = await inquirer.prompt([
        {
          type: "confirm",
          name: "loadMore",
          message: "Load next page?",
          default: false,
        },
      ]);

      if (!loadMore) {
        break;
      }

      const nextSpinner = ora('Loading next page...').start();
      try {
        currentPage = await currentPage.nextPage();
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
    } else {
      console.log(Formatter.formatError(`Unexpected error: ${error.message}`));
    }

    process.exit(1);
  }
}
