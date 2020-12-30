import React from 'react';
import { PointsForDay, getPointsForMilestone } from './utils/issues';

interface GitHubContextProps {
  children: React.ReactNode;
  token: string;
};

interface GitHubContextState {
  loading: boolean;
  error: null | Error;
  data: PointsForDay[];
};

const GitHubContext = React.createContext<GitHubContextState>(null);

export class GitHubContextProvider extends React.Component<GitHubContextProps, GitHubContextState> {
  private _token: string;

  constructor(props: GitHubContextProps) {
    super(props);

    this._token = props.token;

    this.state = {
      loading: true,
      error: null,
      data: [],
    };
  }

  async componentDidMount(): Promise<void> {
    // TODO: accept as props?
    const owner = "newrelic";
    const repo = "docs-website";
    const milestone = 1;

    try {
      const data = await getPointsForMilestone(owner, repo, milestone, this._token);
      this.setState({ data, loading: false });
    } catch (error) {
      console.log('ooooooooooooooooops');
      throw new Error(error);
      console.error(`Unable to fetch data from GitHub: ${err}`, err);
      this.setState({ loading: false, error: err });
    }
  }

  render() {
    return (
      <GitHubContext.Provider value={this.state}>
        {this.props.children}
      </GitHubContext.Provider>
    )
  }
};

export default GitHubContext;