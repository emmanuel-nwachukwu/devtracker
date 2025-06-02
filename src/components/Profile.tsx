import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import type { GitHubRepo, GitHubUser, LanguageStat } from "../types/github";
import { fetchGitHubRepos, fetchGitHubUser } from "../services/github";
import RepoCard from "./RepoCard";
import { fetchUserLanguages } from "../services/githubGraphQL";
import LanguagePieChart from "./LanguagePieChart";

// const GITHUB_USERNAME = "emmanuel-nwachukwu";
type ProfileProps = {
  username: string;
  loading?: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const Profile = ({ username = "", loading, setLoading }: ProfileProps) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState<string>("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [sortKey, setSortKey] = useState("stars");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [loadingLangStats, setLoadingLangStats] = useState(false);
  const [langError, setLangError] = useState("");

  useEffect(() => {
    if (!username) return;

    setLoadingLangStats(true);
    setLangError("");

    fetchUserLanguages(username)
      .then((stats) => setLanguageStats(stats))
      .catch((err) => setLangError(err.message))
      .finally(() => setLoadingLangStats(false));
  }, [username]);

  // page Resetter useEffect
  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey, languageFilter]);

  useEffect(() => {
    setUser(null);
    setError("");
    setRepos([]);
    setLoading(true);

    fetchGitHubUser(username)
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetchGitHubRepos(username)
      .then(setRepos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username, setLoading]);

  if (error) return <p>Error: {error}</p>;
  if (!user || loading)
    return (
      <p className="max-w-md mx-auto p-4 shadow rounded bg-white">Loading...</p>
    );
  // if (loading) return <p>Loading...</p>;

  // Derived list
  const filteredRepos = repos
    // Derived list Filtering
    .filter(
      (repo) => languageFilter === "All" || repo.language === languageFilter
    )
    // Derived list Sorting
    .sort((a, b) => {
      switch (sortKey) {
        case "stars":
          // Most stars first.
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          // Most forks first.
          return b.forks_count - a.forks_count;
        case "name":
          // Return all in alphabetical order A-z.
          return a.name.localeCompare(b.name);
        case "updated":
          return (
            // Latest date first.
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        default:
          return 0;
      }
    });

  const uniqueLanguages = Array.from(
    new Set(repos.map((repo) => repo.language).filter(Boolean))
  );

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [sortKey, languageFilter]);

  const sortOptions = [
    { value: "stars", label: "Sort by Stars" },
    { value: "forks", label: "Sort by Forks" },
    { value: "name", label: "Sort by Name" },
    { value: "updated", label: "Sort by Last Updated" },
  ];

  // Pagination logic page Resetter useEffect above
  const perPage = 5;
  const totalPages = Math.ceil(filteredRepos.length / perPage);
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="max-w-2xl mx-auto">
      {loading ? (
        <p className="p-4 shadow rounded bg-white">Loadinggvhjnjcg...</p>
      ) : (
        <div className="w-full">
          {/* User Profile */}
          <div className="p-4 shadow rounded bg-white mt-6">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h2 className="text-xl font-bold text-center mt-4">{user.name}</h2>
            <p className="text-center text-gray-600">@{user.login}</p>
            <p className="text-center mt-2">{user.bio}</p>
            <div className="flex justify-around mt-4 text-sm text-gray-700">
              <span>Repos: {user.public_repos}</span>
              <span>Followers: {user.followers}</span>
              <span>Following: {user.following}</span>
            </div>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between my-4 gap-2">
            {/* <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="p-2 border rounded">
              <option value="stars">Sort by Stars</option>
              <option value="forks">Sort by Forks</option>
              <option value="name">Sort by Name</option>
              <option value="updated">Sort by Last Updated</option>
            </select> */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="p-2 border rounded">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="p-2 border rounded">
              <option value="All">All languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Repos List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Repositories</h3>
            {paginatedRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          {loadingLangStats && <p>Loading language stats...</p>}
          {langError && <p className="text-red-500">Error: {langError}</p>}
          {languageStats.length > 0 && (
            <LanguagePieChart data={languageStats} />
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pageBtn">
              {currentPage === 1 ? "start" : "prev"}
            </button>
            <span className="p-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="pageBtn">
              {currentPage === totalPages ? "end" : "next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
