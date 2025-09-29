import { SortType, SearchType} from "ytsearch.js";

export type DisplayMode = "default" | "compact" | "online" | "detailed";

export interface GlobalOptions {
  limit?: number;
  sort?: SortType;
  json?: boolean;
  mode?: DisplayMode;
  watch?: boolean;
}

export interface SearchCommandOptions extends GlobalOptions {
  type?: SearchType;
}
