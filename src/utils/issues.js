import { max, min, differenceInDays, addDays, parseISO } from "date-fns";
import { getIssues } from "./api";

// TODO: utility
export const curry = (fn) => (...args) => fn.bind(null, ...args);

// TODO: utility
// TODO: utility for deep nested props
const prop = curry((k, x) => x[k]);

// TODO: utility
export const range = (a, b = false) =>
  b ? [...Array(b).keys()].slice(a) : [...Array(a).keys()];

const getDateRange = (arr) => {
  const dates = arr.map(parseISO);
  const start = min(dates);
  const numDays = differenceInDays(max(dates), start);
  return range(numDays + 1).map((n) => addDays(start, n));
};
export const getPointsForMilestone = async (owner, repo, milestone, token) => {
  try {
    const issues = await getIssues(owner, repo, milestone, token);
    const dates = issues
      .flatMap((issue) => issue.timelineItems.nodes)
      .map(prop("createdAt"));

    return getDateRange(dates);
  } catch (e) {
    throw new Error("Unable to calculate points for milestone.");
  }
};
