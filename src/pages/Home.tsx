import { useState, type FormEvent } from "react";
import Profile from "../components/Profile";

const defaultUsername = import.meta.env.VITE_GITHUB_DEFAULT_USERNAME;

function Home() {
  const [username, setUsername] = useState(defaultUsername);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (e: FormEvent): void => {
    e.preventDefault();
    console.log(username);
    if (input.trim()) {
      setUsername(input.trim());
    } else {
      setUsername(defaultUsername);
    }
    console.log(username);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-2 px-4 sm:p-6 text-black">
      <h1 className="font-bold text-3xl">DevTracker</h1>
      <form
        onSubmit={handleSearch}
        className="my-4 max-w-md mx-auto flex gap-2 break-bar">
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={input}
          name="username"
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded cursor-pointer"
          // onClick={() => setLoading(true)}
        >
          Search
        </button>
      </form>
      <Profile username={username} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default Home;
