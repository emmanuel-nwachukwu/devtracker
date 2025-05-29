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
  return res.json();
};

const fetchGitHubRepos = async (username: string) => {
  const res = await fetch(` https://api.github.com/users/${username}/repos`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch repositories");
  return res.json();
};

export { fetchGitHubUser, fetchGitHubRepos };

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
