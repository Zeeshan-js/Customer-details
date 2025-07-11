import { useState } from "react";
import "./App.css";
import Login from "./Login.jsx";
import Component from "./Component.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/component" element={<Component />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
