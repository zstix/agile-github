import { getIssues } from "../../src/utils/api";
import { OWNER, REPO, TOKEN } from "../../__mocks__/data";

describe("getIssues", () => {
  describe("HTTP call", () => {
    beforeAll(() => {
      global.fetch = jest.fn();
    });

    it("should throw an error if missing a repo owner", async () => {
      expect.assertions(1);

      const error = "Repository owner not provided";
      await expect(getIssues()).rejects.toThrow(error);
    });

    it("should throw an error if missing a repo name", async () => {
      expect.assertions(1);

      const error = "Repository name not provided";
      await expect(getIssues(OWNER)).rejects.toThrow(error);
    });

    it("should throw an error if missing a valid GH token", async () => {
      expect.assertions(3);

      const error = "Valid GitHub token not provided";
      await expect(getIssues(OWNER, REPO)).rejects.toThrow(error);
      await expect(getIssues(OWNER, REPO)).rejects.toThrow(error);
      await expect(getIssues(OWNER, REPO)).rejects.toThrow(error);
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
  });
});
