import React from 'react';
import { TextField, Button } from 'nr1';
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
          <>
            <TextField
              label="Owner"
              value={owner}
              onChange={(e) => this.setState({ owner: e.target.value })}
            />
            <TextField
              label="Repository"
              value={repo}
              onChange={(e) => this.setState({ repo: e.target.value })}
            />
            <TextField
              label="Milestone #"
              value={milestone.toString()}
              onChange={(e) =>
                this.setState({
                  milestone: parseInt(e.target.value, 10)
                })}
            />
            <TextField
              label="token"
              value={token || ''}
              onChange={(e) => this.setState({ token: e.target.value })}
            />

            {!loading && (
              <div style={{ marginTop: '1rem' }}>
                <Button onClick={() => fetchData(this.state)}>
                  Fetch data!
                </Button>
              </div>
            )}
          </>
        )}
      </GitHubContext.Consumer>
    )
  }
}

export default Configuration;