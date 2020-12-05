import { getIssues } from "../../src/utils/api";
import { OWNER, REPO, TOKEN } from "../../__mocks__/data";

describe("getIssues", () => {
  describe("HTTP call", () => {
    beforeAll(() => {
      global.fetch = jest.fn();
    });

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

    it("should throw an error if missing a valid GH token", async () => {
      expect.assertions(3);

      const error = new Error("Valid GitHub token not provided");
      await expect(getIssues(OWNER, REPO)).rejects.toEqual(error);
      await expect(getIssues(OWNER, REPO)).rejects.toEqual(error);
      await expect(getIssues(OWNER, REPO)).rejects.toEqual(error);
    });

    it("should query the GitHub API with correct url", async () => {
      expect.assertions(1);

      await getIssues(OWNER, REPO, TOKEN);
      const url = global.fetch.mock.calls[0][0];
      expect(url).toEqual("https://github.com/api/graphql");
    });

    it("should query the GitHub API with correct headers", async () => {
      expect.assertions(1);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${TOKEN}`,
      };

      await getIssues(OWNER, REPO, TOKEN);
      const options = global.fetch.mock.calls[0][1];
      expect(options.headers).toEqual(headers);
    });

    it("should throw an error if the HTTP call fails", async () => {
      expect.assertions(1);
      global.fetch = jest.fn(() => Promise.reject());

      const error = new Error("Unable to fetch issues from GitHub");
      await expect(getIssues(OWNER, REPO, TOKEN)).rejects.toEqual(error);
    });
  });
});
