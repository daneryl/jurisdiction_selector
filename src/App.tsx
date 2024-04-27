import { useEffect, useState } from "react";
import "./App.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { fetchJurisdictions, fetchSubJurisdictions } from "./fake_api.js";

type Jurisdiction = {
  id: number;
  name: string;
};

function App() {
  const [jurisdictions, setJurisdictions] = useState<{
    [k: string]: Jurisdiction[];
  }>({});

  useEffect(() => {
    fetchJurisdictions().then((jurisdictions: Jurisdiction[]) => {
      setJurisdictions({ 0: jurisdictions });
    });
  }, []);

  const loadSubJurisdictions = (jurisdiction: Jurisdiction) => {
    setJurisdictions({ ...jurisdictions, ...{ [jurisdiction.id]: [] } });
    fetchSubJurisdictions(jurisdiction.id).then(
      (subjurisdictions: Jurisdiction[]) => {
        setJurisdictions({
          ...jurisdictions,
          ...{ 1: subjurisdictions },
        });
      }
    );
  };

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
              loadSubJurisdictions(jurisdiction);
            }}
          >
            {jurisdiction.name}
            {jurisdictions[jurisdiction.id] &&
              !jurisdictions[jurisdiction.id].length && (
                <div>Loading {jurisdiction.name} ...</div>
              )}

            {jurisdictions[jurisdiction.id] &&
              jurisdictions[jurisdiction.id].length &&
              jurisdictions[jurisdiction.id].map((sub) => {
                return <div
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSubJurisdictions(sub);
                  }}
                >
                  {sub.name}
                  {jurisdictions[sub.id] &&
                    !jurisdictions[sub.id].length && (
                      <div>Loading {sub.name} ...</div>
                    )}

                  {jurisdictions[sub.id] &&
                    jurisdictions[sub.id].length &&
                    jurisdictions[sub.id].map((sub2) => {
                      return <div>{sub2.name}</div>;
                    })}
                </div>;
              })}
          </div>
        );
      })}
    </>
  );
}

export default App;
