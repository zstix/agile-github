import { getIssues } from "../../src/utils/api";
import { OWNER, REPO, TOKEN, MILESTONE } from "../../__mocks__/data";
import { QUERY } from "../../src/constants";

const data = {
  repository: {
    milestone: {
      title: "Test MMF Milestone",
      issues: [],
    },
  },
};

const RESP = { json: () => Promise.resolve({ data }) };

describe("getIssues", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve(RESP));
  });

  describe("Parameters", () => {
    it("should throw an error if missing a repo owner", async () => {
      expect.assertions(1);

      const error = new Error("Repository owner not provided");
      await expect(getIssues()).rejects.toEqual(error);
    });

    it("should throw an error if missing a repo name", async () => {
      expect.assertions(1);

      const error = new Error("Repository name not provided");
      await expect(getIssues(OWNER)).rejects.toEqual(error);
    });

    it("should throw an error if missing a milestone number", async () => {
      expect.assertions(1);

      const error = new Error("Milestone number not provided");
      await expect(getIssues(OWNER, REPO)).rejects.toEqual(error);
    });

    it("should throw an error if missing a valid GH token", async () => {
      expect.assertions(3);

      const error = new Error("Valid GitHub token not provided");
      await expect(getIssues(OWNER, REPO, MILESTONE)).rejects.toEqual(error);
      await expect(getIssues(OWNER, REPO, MILESTONE)).rejects.toEqual(error);
      await expect(getIssues(OWNER, REPO, MILESTONE)).rejects.toEqual(error);
    });
  });

  describe("HTTP call", () => {
    it("should query the GitHub API with correct url", async () => {
      expect.assertions(1);

      await getIssues(OWNER, REPO, MILESTONE, TOKEN);
      const url = global.fetch.mock.calls[0][0];
      expect(url).toEqual("https://github.com/api/graphql");
    });

    it("should query the GitHub API with correct headers", async () => {
      expect.assertions(2);

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.starfox-preview+json",
        Authorization: `bearer ${TOKEN}`,
      };

      await getIssues(OWNER, REPO, MILESTONE, TOKEN);
      const options = global.fetch.mock.calls[0][1];

      expect(options.headers).toEqual(headers);
      expect(options.method).toEqual("post");
    });

    it("should throw an error if the HTTP call fails", async () => {
      expect.assertions(1);
      global.fetch = jest.fn(() => Promise.reject());

      const error = new Error("Unable to fetch issues from GitHub");
      await expect(getIssues(OWNER, REPO, MILESTONE, TOKEN)).rejects.toEqual(
        error
      );
    });
  });

  describe("GraphQL", () => {
    it("should send the correct query", async () => {
      expect.assertions(3);

      await getIssues(OWNER, REPO, MILESTONE, TOKEN);
      const { body } = global.fetch.mock.calls[0][1];
      const { query } = JSON.parse(body);

      expect(body).not.toBeUndefined();
      expect(query).not.toBeUndefined();
      expect(query).toEqual(QUERY.GET_ISSUES);
    });

    it("should send the correct variables", async () => {
      expect.assertions(5);

      await getIssues(OWNER, REPO, MILESTONE, TOKEN);
      const { body } = global.fetch.mock.calls[0][1];
      const { variables } = JSON.parse(body);

      expect(body).not.toBeUndefined();
      expect(variables).not.toBeUndefined();
      expect(variables.owner).toEqual(OWNER);
      expect(variables.repo).toEqual(REPO);
      expect(variables.milestone).toEqual(MILESTONE);
    });
  });

  describe("Response", () => {
    it("should return the unwrapped data on success", async () => {
      expect.assertions(7);

      const data = await getIssues(OWNER, REPO, MILESTONE, TOKEN);

      expect(data).not.toBeUndefined();
      expect(Object.keys(data)).not.toContain("data");
      expect(Object.keys(data)).not.toContain("repository");
      expect(Object.keys(data)).not.toContain("milestone");
      expect(Object.keys(data)).not.toContain("issues");
      expect(data).toBeInstanceOf(Array);
      expect(data).toEqual([]);
    });

    it("should throw an error if GraphQL gives an error", async () => {
      expect.assertions(1);

      const resp = { json: () => Promise.resolve({ errors: "Yikes!" }) };
      global.fetch = jest.fn(() => Promise.resolve(resp));

      const error = new Error("Issue with GraphQL query");
      await expect(getIssues(OWNER, REPO, MILESTONE, TOKEN)).rejects.toEqual(
        error
      );
    });
  });
});
