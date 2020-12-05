const API_URL = "https://github.com/api/graphql";

export const getIssues = async (owner, repo, token) => {
  const valid = !!token && typeof token === "string" && token.length === 40;

  if (!owner) throw new Error("Repository owner not provided");
  if (!repo) throw new Error("Repository name not provided");
  if (!valid) throw new Error("Valid GitHub token not provided");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };

  try {
    await fetch(API_URL, { headers });
  } catch (e) {
    throw new Error("Unable to fetch issues from GitHub");
  }
};
