import { useEffect } from "react";

function App() {
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("API URL:", API);

    fetch(`${API}/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Response data:", data);
        console.log("Message:", data.message);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, [API]);

  return (
    <div>
      <h1>Care Planner</h1>
      <p>Check console for API response</p>
    </div>
  );
}

export default App;