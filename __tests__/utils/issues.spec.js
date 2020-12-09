import { getPointsForMilestone } from "../../src/utils/issues";
import { OWNER, REPO, TOKEN, MILESTONE } from "../../__mocks__/data";

const mockEvents = (data) =>
  data.map((d) => ({
    previousProjectcolumnName: d.from,
    projectColumnName: d.to,
    createdAt: `2020-${d.date}T00:00:00Z`,
  }));

const mockIssue = ({ name, points, events }) => ({
  title: name,
  labels: { nodes: [{ name: `sp:${points}` }] },
  timelineItems: {
    nodes: mockEvents(events),
  },
});

const mockWithResponse = (issues = []) => {
  const graph = {
    data: {
      repository: {
        milestone: {
          title: "Test MMF Milestone",
          issues: {
            nodes: issues.map(mockIssue),
          },
        },
      },
    },
  };

  const resp = { json: () => Promise.resolve(graph) };
  global.fetch = jest.fn(() => Promise.resolve(resp));
};

const ISSUES_SIMPLE = [
  {
    name: "Test Issue 1",
    points: 1,
    events: [
      { from: "To Do", to: "In Progress", date: "08-24" },
      { from: "In Progress", to: "For Review", date: "08-25" },
      { from: "For Review", to: "Done", date: "08-28" },
    ],
  },
  {
    name: "Test Issue 2",
    points: 5,
    events: [
      { from: "To Do", to: "In Progress", date: "08-25" },
      { from: "In Progress", to: "For Review", date: "08-27" },
      { from: "For Review", to: "Done", date: "08-27" },
    ],
  },
];

describe("getPointsForMilestone", () => {
  describe("Return format", () => {
    beforeEach(() => {
      mockWithResponse(ISSUES_SIMPLE);
    });

    it("should return an array", async () => {
      expect.assertions(1);

      const data = await getPointsForMilestone(OWNER, REPO, MILESTONE, TOKEN);

      expect(data).toBeInstanceOf(Array);
    });

    it("should return an array of days", async () => {
      expect.assertions(3);

      const data = await getPointsForMilestone(OWNER, REPO, MILESTONE, TOKEN);

      expect(data).toHaveLength(5);
      expect(data[0].date).toEqual(new Date("2020-08-24"));
      expect(data[4].date).toEqual(new Date("2020-08-28"));
    });

    it("should return an array of columns for each day", async () => {
      expect.assertions(5);

      const data = await getPointsForMilestone(OWNER, REPO, MILESTONE, TOKEN);
      const { columns } = data[0];

      expect(columns).toBeInstanceOf(Array);
      expect(columns[0].label).toEqual("To Do");
      expect(columns[1].label).toEqual("In Progress");
      expect(columns[2].label).toEqual("For Review");
      expect(columns[3].label).toEqual("Done");
    });
  });
});
