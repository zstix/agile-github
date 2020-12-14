import {
  max,
  min,
  differenceInDays,
  isSameDay,
  addDays,
  parseISO,
} from "date-fns";
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

const getPointsForIssue = ({ labels }) => {
  const label = labels.nodes.find(({ name }) => name.includes("sp"));

  return parseInt(label.name.split(":")[1], 10);
};

const getPointsForDay = (issues) => (date) => {
  let columns = COLUMNS.map((label) => ({ label, points: 0 }));

  // TODO: use rduce to remove side-effects
  // loop over each issue and determine which column it belongs to
  issues.forEach((issue) => {
    const points = getPointsForIssue(issue);
    const events = issue.timelineItems.nodes;

    const eventsForDate = events.filter((e) =>
      isSameDay(parseISO(e.createdAt), date)
    );
    const lastEvent = eventsForDate.slice(-1)[0];
    const label = lastEvent ? lastEvent.projectColumnName : COLUMNS[0];

    columns = columns.map((c) =>
      c.label === label ? { ...c, points: c.points + points } : c
    );
  });

  return { date, columns };
};

export const getPointsForMilestone = async (owner, repo, milestone, token) => {
  try {
    const issues = await getIssues(owner, repo, milestone, token);
    const events = issues.flatMap(get("timelineItems.nodes"));
    const dates = events.map(prop("createdAt"));

    return getDateRange(dates).map(getPointsForDay(issues));
  } catch (e) {
    throw new Error("Unable to calculate points for milestone.");
  }
};
