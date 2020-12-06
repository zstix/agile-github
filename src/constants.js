const GET_ISSUES = `
query getIssues($owner: String!, $repo: String!, $milestone: Int!) {
  repository(name: $repo, owner: $owner) {
    milestone(number: $milestone) {
      title
      issues(first: 100) {
        nodes {
          title
          labels(first: 10) {
            nodes {
              name
            }
          }
          timelineItems(first: 50) {
            nodes {
              ... on MovedColumnsInProjectEvent {
                previousProjectColumnName
                projectColumnName
                createdAt
              }
            }
          }
        }
      }
    }
  }
}
`;

export const QUERY = {
  GET_ISSUES,
};
