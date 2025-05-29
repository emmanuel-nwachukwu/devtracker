type GitHubUser = {
  login: string;
  avatar_url: string;
  bio: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
};

export { GitHubUser, GitHubRepo };
