interface IGitHubConfiguration {
  owner: string;
  repo: string;
  milestone: number;
  token: string;
}

interface IGitHubColumn {
  label: string;
  points: number;
}

interface IGitHubData {
  date: Date;
  columns: IGitHubColumn[];
}

interface IGitHubTimelineItem {
  previousProjectColumnName: string;
  projectColumnName: string;
  createdAt: string;
}