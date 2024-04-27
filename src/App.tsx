import { useEffect, useState } from "react";
import "./App.css";
import { fetchJurisdictions, fetchSubJurisdictions } from "./fake_api";

function App() {
  const [jurisdictions, setJurisdictions] = useState([]);
  const [subJurisdictions, setSubJurisdictions] = useState({});

  useEffect(() => {
    fetchJurisdictions().then((response) => {
      setJurisdictions(response);
    });
  }, []);

  if (!jurisdictions.length) {
    return (
      <>
        <div>Loading ...</div>
      </>
    );
  }

  return (
    <>
      {jurisdictions.map((jurisdiction) => {
        return (
          <div
            onClick={() => {
              setSubJurisdictions({ ...subJurisdictions, ...{ 1: [] } });
              fetchSubJurisdictions(jurisdiction.id).then(
                (subjurisdictions) => {
                  setSubJurisdictions({
                    ...subJurisdictions,
                    ...{ 1: subjurisdictions },
                  });
                }
              );
            }}
          >
            {jurisdiction.name}
            {subJurisdictions[jurisdiction.id] &&
              !subJurisdictions[jurisdiction.id].length && (
                <div>Loading {jurisdiction.name} ...</div>
              )}

            {subJurisdictions[jurisdiction.id] &&
              subJurisdictions[jurisdiction.id].length &&
              subJurisdictions[jurisdiction.id].map((subjurisdiction) => {
                return <div>{subjurisdiction.name}</div>;
              })}
          </div>
        );
      })}
    </>
  );
}

export default App;
