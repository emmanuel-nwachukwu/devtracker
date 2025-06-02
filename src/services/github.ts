import type { GitHubRepo } from "../types/github";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const headers: HeadersInit = GITHUB_TOKEN
  ? {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    }
  : {};

const fetchGitHubUser = async (username: string) => {
  const res = await fetch(` https://api.github.com/users/${username}`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  // console.log("Line 15 : ", res.json());
  return res.json();
};

const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
  const res = await fetch(` https://api.github.com/users/${username}/repos`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch repositories");
  // console.log("Line 23 : ", res.json());
  return res.json();
};

const fetchRepoDetail = async (
  username: string,
  repoName: string
): Promise<GitHubRepo> => {
  const res = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`,
    { headers }
  );
  if (!res.ok) throw new Error("Failed to fetch repo detail");
  return res.json();
};

export { fetchGitHubUser, fetchGitHubRepos, fetchRepoDetail };

// const fetchGitHubUser = async (username: string) => {
//   try {
//     const res = await fetch(` https://api.github.com/users/${username}`);
//   if (!res.ok) throw new Error("Failed to fetch user");
//   return res.json();
//   } catch (error:any) {
//     return {
//       succes:false,
//       status:500,
//       data:null,
//       errors:error.message
//     }
//   }
// };
