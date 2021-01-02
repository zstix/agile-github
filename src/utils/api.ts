import fetch from 'node-fetch';
import { API_URL, QUERY, HEADERS } from "../constants";

export interface Issue {
  title: string;
  labels: {
    nodes: {
      name: string
    }[];
  };
  timelineItems: {
    nodes: IGitHubTimelineItem[]
  }
};

interface GetIssuesResponse {
  data: {
    repository: {
      milestone: {
        issues: {
          nodes: Issue[];
        }
      }
    }
  },
  errors: any;
};

export const getIssues = async (config: IGitHubConfiguration): Promise<Issue[]> => {
  const { owner, repo, milestone, token } = config;
  const valid = !!token && typeof token === "string" && token.length === 40;

  if (!owner) throw new Error("Repository owner not provided");
  if (!repo) throw new Error("Repository name not provided");
  if (!milestone) throw new Error("Milestone number not provided");
  if (!valid) throw new Error("Valid GitHub token not provided");

  const headers = { ...HEADERS, Authorization: `bearer ${token}` };
  const variables = { owner, repo, milestone };
  const body = JSON.stringify({ query: QUERY.GET_ISSUES, variables });
  const options = { method: "post", headers, body };

  try {
    const resp = await fetch(API_URL, options);
    const json: GetIssuesResponse = await resp.json();

    if (json.errors) throw new Error("Issue with GraphQL query");

    return json.data.repository.milestone.issues.nodes;
  } catch (error) {
    throw new Error(
      error ? error.message : "Unable to fetch issues from GitHub"
    );
  }
};
