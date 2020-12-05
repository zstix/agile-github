export const getIssues = async (owner, repo, token) => {
  const is_invalid =
    !token || typeof token !== "String" || token.length() !== 40;

  if (!owner) throw new Error("Repository owner not provided");
  if (!repo) throw new Error("Repository name not provided");
  if (is_invalid) throw new Error("Valid GitHub token not provided");
};
