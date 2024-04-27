import { useEffect, useState } from "react";
import "./App.css";
import { fetchJurisdictions, fetchSubJurisdictions } from "./fake_api";

function App() {
  const [jurisdictions, setJurisdictions] = useState({});

  useEffect(() => {
    fetchJurisdictions().then((jurisdictions) => {
      setJurisdictions({0: jurisdictions});
    });
  }, []);

  if (!Object.keys(jurisdictions).length) {
    return (
      <>
        <div>Loading ...</div>
      </>
    );
  }

  return (
    <>
      {jurisdictions[0].map((jurisdiction) => {
        return (
          <div
            onClick={() => {
              setJurisdictions({ ...jurisdictions, ...{ 1: [] } });
              fetchSubJurisdictions(jurisdiction.id).then(
                (subjurisdictions) => {
                  setJurisdictions({
                    ...jurisdictions,
                    ...{ 1: subjurisdictions },
                  });
                }
              );
            }}
          >
            {jurisdiction.name}
            {jurisdictions[jurisdiction.id] &&
              !jurisdictions[jurisdiction.id].length && (
                <div>Loading {jurisdiction.name} ...</div>
              )}

            {jurisdictions[jurisdiction.id] &&
              jurisdictions[jurisdiction.id].length &&
              jurisdictions[jurisdiction.id].map((subjurisdiction) => {
                return <div>{subjurisdiction.name}</div>;
              })}
          </div>
        );
      })}
    </>
  );
}

export default App;
