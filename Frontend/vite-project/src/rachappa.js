import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .post("http://localhost:5001/")
      .then((res) => {
        console.log("Response:", res.data);
        setMessage(res.data.message); // 👈 store it
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-bold">
        {message || "Loading..."}
      </h1>
    </div>
  );
};

export default App;
