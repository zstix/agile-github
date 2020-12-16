import { getPointsForMilestone } from "../../src/utils/issues";
import { VALID_ARGS } from "../../__mocks__/data";
import { mockWithResponse } from "../helpers";

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
  beforeEach(() => {
    mockWithResponse(ISSUES_SIMPLE);
  });

  describe("Return format", () => {
    it("should return an array", async () => {
      expect.assertions(1);

      const days = await getPointsForMilestone(...VALID_ARGS);

      expect(days).toBeInstanceOf(Array);
    });

    it("should return an array of days", async () => {
      expect.assertions(3);

      const days = await getPointsForMilestone(...VALID_ARGS);

      expect(days).toHaveLength(5);
      expect(days[0].date).toEqual(new Date("2020-08-24"));
      expect(days[4].date).toEqual(new Date("2020-08-28"));
    });

    it("should return an array of columns for each day", async () => {
      expect.assertions(5);

      const [first] = await getPointsForMilestone(...VALID_ARGS);
      const { columns } = first;

      expect(columns).toBeInstanceOf(Array);
      expect(columns[0].label).toEqual("To Do");
      expect(columns[1].label).toEqual("In Progress");
      expect(columns[2].label).toEqual("For Review");
      expect(columns[3].label).toEqual("Done");
    });
  });

  describe("data", () => {
    it("should calulate the correct number of points per day", async () => {
      expect.assertions(4);

      const [first] = await getPointsForMilestone(...VALID_ARGS);
      const [todo, inProgress, forReview, done] = first.columns;

      expect(todo.points).toEqual(5);
      expect(inProgress.points).toEqual(1);
      expect(forReview.points).toEqual(0);
      expect(done.points).toEqual(0);
    });

    it("should handle multiple column movements in one day", async () => {
      expect.assertions(2);

      const resp = [
        {
          name: "Foo Bar",
          points: 1,
          events: [
            { from: "To Do", to: "In Progress", date: "08-24" },
            { from: "In Progress", to: "For Review", date: "08-24" },
          ],
        },
      ];
      mockWithResponse(resp);

      const [first] = await getPointsForMilestone(...VALID_ARGS);
      const inProgress = first.columns[1];
      const forReview = first.columns[2];

      expect(inProgress.points).toEqual(0);
      expect(forReview.points).toEqual(1);
    });

    it("should handle tickets moving in reverse", async () => {
      expect.assertions(2);

      const resp = [
        {
          name: "Foo Bar",
          points: 1,
          events: [
            { from: "To Do", to: "In Progress", date: "08-24" },
            { from: "In Progress", to: "For Review", date: "08-24" },
            { from: "For Review", to: "In Progress", date: "08-24" },
          ],
        },
      ];
      mockWithResponse(resp);

      const [first] = await getPointsForMilestone(...VALID_ARGS);
      const inProgress = first.columns[1];
      const forReview = first.columns[2];

      expect(inProgress.points).toEqual(1);
      expect(forReview.points).toEqual(0);
    });
  });
});
