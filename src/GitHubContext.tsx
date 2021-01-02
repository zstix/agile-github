import React from 'react';
import { getPointsForMilestone } from './utils/issues';

interface IGitHubContextProps {
  children: React.ReactNode;
};

interface IGitHubContextState {
  loading: boolean;
  error: Error;
  data: IGitHubData[];
  fetchData: (options: IGitHubConfiguration) => Promise<void>;
};

const GitHubContext = React.createContext<IGitHubContextState>(null);

export class GitHubContextProvider extends React.Component<IGitHubContextProps, IGitHubContextState> {
  constructor(props: IGitHubContextProps) {
    super(props);

    this.fetchData = this.fetchData.bind(this);

    this.state = {
      loading: false,
      error: null,
      data: [],
      fetchData: this.fetchData,
    };
  }

  async fetchData(config: IGitHubConfiguration): Promise<void> {
    this.setState({ loading: true });

    try {
      const data = await getPointsForMilestone(config);
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