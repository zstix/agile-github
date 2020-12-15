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

const DEFAULT_COLUMNS = ["To Do", "In Progress", "For Review", "Done"];

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

const getPointsForDay = (issues, columnNames) => (date) => {
  let columns = columnNames.map((label) => ({ label, points: 0 }));

  // TODO: use rduce to remove side-effects
  // loop over each issue and determine which column it belongs to
  issues.forEach((issue) => {
    const points = getPointsForIssue(issue);
    const events = issue.timelineItems.nodes;

    const eventsForDate = events.filter((e) =>
      isSameDay(parseISO(e.createdAt), date)
    );
    const lastEvent = eventsForDate.slice(-1)[0];
    const label = lastEvent ? lastEvent.projectColumnName : columnNames[0];

    columns = columns.map((c) =>
      c.label === label ? { ...c, points: c.points + points } : c
    );
  });

  return { date, columns };
};

/**
 * Gets a list of days and the number of points each column had on that
 * particular day.
 *
 * @param {string} owner The repository owner.
 * @param {string} repo The repository name.
 * @param {number} milestone The milestone number.
 * @param {string} token The GitHub access token (for the API call).
 * @param {[string]} [userColumns] An (optional) array of column names.
 * @returns {[object]} An array of day objects.
 */
export const getPointsForMilestone = async (
  owner,
  repo,
  milestone,
  token,
  userColumns
) => {
  try {
    const issues = await getIssues(owner, repo, milestone, token);
    const events = issues.flatMap(get("timelineItems.nodes"));
    const dates = events.map(prop("createdAt"));
    const columns = userColumns || DEFAULT_COLUMNS;

    return getDateRange(dates).map(getPointsForDay(issues, columns));
  } catch (e) {
    throw new Error("Unable to calculate points for milestone.");
  }
};
