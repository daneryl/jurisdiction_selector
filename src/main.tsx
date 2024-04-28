import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { fetchJurisdictions, fetchSubJurisdictions } from "./fake_api.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App
      useJurisdictionsAPI={() => {
        return { fetchJurisdictions, fetchSubJurisdictions };
      }}
      onChange={() => {
        
      }}
    />
  </React.StrictMode>
);
