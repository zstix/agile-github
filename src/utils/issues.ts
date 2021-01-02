import {
  max,
  min,
  differenceInDays,
  isSameDay,
  addDays,
  parseISO,
} from "date-fns";
import { prop, get, range } from "./functional";
import { getIssues, Issue } from "./api";
import { DEFAULT_COLUMNS } from '../constants';

const getDateRange = (dateStrings: string[]): Date[] => {
  const dates = dateStrings.map(str => parseISO(str));
  const start = min(dates);
  const numDays = differenceInDays(max(dates), start) + 1;

  return range(numDays).map((n) => addDays(start, n));
};

const getPointsForIssue = ({ labels }: Issue) => {
  const label = labels.nodes.find(({ name }) => name.includes("sp"));

  return parseInt(label.name.split(":")[1], 10);
};

const getPointsForDay = (issues: Issue[], columnNames: string[]) =>
  (date: Date): IGitHubData => {
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
 */
export const getPointsForMilestone = async (
  config: IGitHubConfiguration & {
    userColumns?: string[]
  }
): Promise<IGitHubData[]> => {
  const { userColumns } = config;

  try {
    const issues = await getIssues(config);
    const events: IGitHubTimelineItem[] = issues.flatMap(get("timelineItems.nodes"));
    const dates = events.map(prop("createdAt")).filter(Boolean);
    const columns = userColumns || DEFAULT_COLUMNS;

    return getDateRange(dates).map(getPointsForDay(issues, columns));
  } catch (error) {
    throw new Error(`Unable to calculate points for milestone: ${error}`);
  }
};
