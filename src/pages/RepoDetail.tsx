import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GitHubRepo } from "../types/github";
import { fetchRepoDetail } from "../services/github";

const RepoDetail = () => {
  const { username, repoName } = useParams<{
    username: string;
    repoName: string;
  }>();
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (username && repoName) {
      fetchRepoDetail(username, repoName)
        .then(setRepo)
        .catch((err) => setError(err.message));
    }
  }, [username, repoName]);

  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!repo) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{repo.full_name}</h1>
      <p className="mt-2 text-gray-700">{repo.description}</p>
      <div className="mt-4 text-sm text-gray-600">
        <p>⭐ Stars: {repo.stargazers_count}</p>
        <p>🍴 Forks: {repo.forks_count}</p>
        <p>🧠 Language: {repo.language}</p>
        <p>
          🔗{" "}
          <a
            href={repo.html_url}
            className="text-blue-500 underline"
            target="_blank">
            View on GitHub
          </a>
        </p>
        <p className="mt-2 text-xs text-gray-500">Updated at: {new Date(repo.updated_at).toLocaleString()}</p>
        <p></p>
      </div>
    </div>
  );
};

export default RepoDetail;
