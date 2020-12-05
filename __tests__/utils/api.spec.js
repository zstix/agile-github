import { getIssues } from "../../src/utils/api";

describe("getIssues", () => {
  describe("HTTP call", () => {
    it("should throw an error if missing a repo owner", async () => {
      expect.assertions(1);

      const error = "Repository owner not provided";
      await expect(getIssues()).rejects.toThrow(error);
    });

    it("should throw an error if missing a repo name", async () => {
      expect.assertions(1);

      const error = "Repository name not provided";
      await expect(getIssues("nr")).rejects.toThrow(error);
    });

    it("should throw an error if missing a valid GH token", async () => {
      expect.assertions(3);

      const error = "Valid GitHub token not provided";
      await expect(getIssues("nr", "dds")).rejects.toThrow(error);
      await expect(getIssues("nr", "dds", 123)).rejects.toThrow(error);
      await expect(getIssues("nr", "dds", "abc")).rejects.toThrow(error);
    });

    it.todo("should query the GitHub API with correct headers");
    it.todo("should query the GitHub API with the correct query");
  });
});
