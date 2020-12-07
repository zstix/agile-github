import { getPointsForMilestone } from "../../src/utils/issues";
import { OWNER, REPO, TOKEN, MILESTONE } from "../../__mocks__/data";

const mockEvents = (data) =>
  data.map((d) => ({
    previousProjectcolumnName: d.from,
    projectColumnName: d.to,
    createdAt: `2020-${d.date}T16:49:36Z`,
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

describe("getPointsForMilestone", () => {
  it.only("should return a list of objects", async () => {
    expect.assertions(2);

    mockWithResponse([
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
    ]);

    const data = await getPointsForMilestone(OWNER, REPO, MILESTONE, TOKEN);

    expect(data).toBeInstanceOf(Array);
    expect(data).toHaveLength(5);
  });
});
