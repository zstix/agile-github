import { getIssues } from "./api";

export const getPointsForMilestone = async (owner, repo, milestone, token) => {
  try {
    const issues = await getIssues(owner, repo, milestone, token);

    return issues;
  } catch (e) {
    throw new Error("Unable to calculate points for milestone.");
  }
};
