import { max, min, differenceInDays, addDays, parseISO } from "date-fns";
import { prop, get, range } from "./functional";
import { getIssues } from "./api";

// TODO: FP
const getDateRange = (arr) => {
  const dates = arr.map(parseISO);
  const start = min(dates);
  const numDays = differenceInDays(max(dates), start) + 1;

  return range(numDays).map((n) => addDays(start, n));
};

export const getPointsForMilestone = async (owner, repo, milestone, token) => {
  try {
    const issues = await getIssues(owner, repo, milestone, token);
    const dates = issues
      .flatMap(get("timelineItems.nodes"))
      .map(prop("createdAt"));

    return getDateRange(dates);
  } catch (e) {
    throw new Error("Unable to calculate points for milestone.");
  }
};
