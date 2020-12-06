import { QUERY } from "../constants";

const API_URL = "https://github.com/api/graphql";

// HTTP headers, including a feature flag for project column events
const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/vnd.github.starfox-preview+json",
};

export const getIssues = async (owner, repo, milestone, token) => {
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
    await fetch(API_URL, options);
  } catch (e) {
    throw new Error("Unable to fetch issues from GitHub");
  }
};
