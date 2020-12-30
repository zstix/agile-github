import React from 'react';
import { PointsForDay, getPointsForMilestone } from './utils/issues';

interface GitHubContextProps {
  children: React.ReactNode;
  token: string;
};

interface GitHubContextState {
  loading: boolean;
  error: Error;
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
      this.setState({ loading: false, error });
      throw new Error(`Unable to fetch data from GitHub: ${error}`);
    }
  }

  render() {
    if (this.state.error) throw this.state.error;

    return (
      <GitHubContext.Provider value={this.state}>
        {this.props.children}
      </GitHubContext.Provider>
    )
  }
};

export default GitHubContext;