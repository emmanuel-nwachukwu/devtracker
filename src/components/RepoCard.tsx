import { Link, useNavigate } from "react-router-dom";
import type { GitHubRepo } from "../types/github";

type RepoCardProps = {
  repo: GitHubRepo;
};

export default function RepoCard({ repo }: RepoCardProps) {
  const navigate = useNavigate();

  const OnRepoContainerClick = () => {
    navigate(`/repo/${repo.owner.login}/${repo.name}`);
  };

  return (
    <div
      className="flex flex-col bg-gray-100 hover:bg-gray-300 p-2 rounded shadow cursor-pointer"
      onClick={OnRepoContainerClick}>
      {/* <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-blue-600">
        {repo.name}
      </a> */}
      <Link
        to={`/repo/${repo.owner.login}/${repo.name}`}
        className="text-lg font-semibold text-blue-600">
        {repo.name}
      </Link>
      {repo.description && (
        <p className="text-sm text-gray-700">{repo.description}</p>
      )}

      <div className="flex gap-4 text-sm text-gray-600 mt-2">
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴{repo.forks_count}</span>
        {repo.language && <span>🧠 {repo.language}</span>}
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Updated at: {new Date(repo.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}
