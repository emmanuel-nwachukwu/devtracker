import { useState, type FormEvent } from "react";
import "./App.css";
import Profile from "./components/Profile";

function App() {
  const [username, setUsername] = useState("emmanuel-nwachukwu");
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log(username);
    if (input.trim()) {
      setUsername(input.trim());
    }
    console.log(username);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <form
        onSubmit={handleSubmit}
        className="mb-4 max-w-md mx-auto flex gap-2">
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
          className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer"
          // onClick={() => setLoading(true)}
        >
          Search
        </button>
      </form>
      <Profile username={username} loading={loading} setLoading={setLoading} />
    </div>
  );
}

export default App;
