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

export const mockWithResponse = (issues = []) => {
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
