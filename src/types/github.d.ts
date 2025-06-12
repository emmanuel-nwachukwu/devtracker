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
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  owner: {
    login: string;
  };
};

// For GraphQL
type LanguageStat = {
  name: string;
  color: string;
  size: number;
};

// For GraphQL
type LanguageBreakdown = {
  languages: {
    edges: {
      node: {
        name: string;
        color: string;
      };
      size: number;
    }[];
  };
};

// For GraphQL
type ReqType = {
  user: {
    repositories: {
      edges: {
        node: {
          languages: {
            edges: { node: { name: string; color: string }; size: number }[];
          };
        };
      }[];
    };
  };
}

export { GitHubUser, GitHubRepo, LanguageBreakdown, LanguageStat, ReqType };
