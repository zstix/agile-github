import React from 'react';
import GitHubContext from '../GitHubContext';

class Configuration extends React.Component<{}, IGitHubConfiguration> {
  constructor(props: {}) {
    super(props);

    // TODO: ability to update
    // TODO: local storage?
    this.state = {
      owner: 'newrelic',
      repo: 'docs-website',
      milestone: 1,
      token: null,
    };
  }

  render() {
    const { owner, repo, milestone, token } = this.state;

    return (
      <GitHubContext.Consumer>
        {({ loading, fetchData }) => (
          <form>
            <input
              placeholder="Owner"
              value={owner}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ owner: e.target.value });
              }}
            />
            <input
              placeholder="Repository"
              value={repo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ repo: e.target.value });
              }}
            />
            <input
              placeholder="Milestone #"
              type="number"
              value={milestone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ milestone: parseInt(e.target.value, 10) });
              }}
            />
            <input
              placeholder="token"
              value={token || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ token: e.target.value });
              }}
            />

            {!loading && (
              <input
                type="button"
                value="Fetch data!"
                onClick={() => fetchData(this.state)}
              />
            )}
          </form>
        )}
      </GitHubContext.Consumer>
    )
  }
}

export default Configuration;