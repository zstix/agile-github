const API_URL = "https://github.com/api/graphql";

const HEADERS = {
  "Content-Type": "application/json",
  // feature flag for project column events
  Accept: "application/vnd.github.starfox-preview+json",
};

export const getIssues = async (owner, repo, token) => {
  const valid = !!token && typeof token === "string" && token.length === 40;

  if (!owner) throw new Error("Repository owner not provided");
  if (!repo) throw new Error("Repository name not provided");
  if (!valid) throw new Error("Valid GitHub token not provided");

  const headers = { ...HEADERS, Authorization: `bearer ${token}` };
  const body = JSON.stringify({ query: "foobar" });
  const options = { method: "post", headers, body };

  try {
    await fetch(API_URL, options);
  } catch (e) {
    throw new Error("Unable to fetch issues from GitHub");
  }
};
