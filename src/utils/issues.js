import { max, min, differenceInDays, addDays, parseISO } from "date-fns";
import { prop, get, range } from "./functional";
import { getIssues } from "./api";

// NOTE: this should probably be supplied by the user
const COLUMNS = ["To Do", "In Progress", "For Review", "Done"];

const getDateRange = (arr) => {
  const dates = arr.map(parseISO);
  const start = min(dates);
  const numDays = differenceInDays(max(dates), start) + 1;

  return range(numDays).map((n) => addDays(start, n));
};

const getPointsForDay = (events) => (date) => {
  const columns = COLUMNS.map((c) => ({ label: c }));

  return { date, columns };
};

export const getPointsForMilestone = async (owner, repo, milestone, token) => {
  try {
    const issues = await getIssues(owner, repo, milestone, token);
    const events = issues.flatMap(get("timelineItems.nodes"));
    const dates = events.map(prop("createdAt"));

    return getDateRange(dates).map(getPointsForDay(events));
  } catch (e) {
    throw new Error("Unable to calculate points for milestone.");
  }
};
