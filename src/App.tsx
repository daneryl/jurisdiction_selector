import { useEffect, useState } from "react";
import "./App.css";

export type Jurisdiction = {
  id: number;
  name: string;
};

type JurisdictionsAPI = {
  fetchJurisdictions: () => Promise<Jurisdiction[]>;
  fetchSubJurisdictions: (id: number) => Promise<Jurisdiction[]>;
};

function App({
  useJurisdictionsAPI,
  onChange,
}: {
  useJurisdictionsAPI: () => JurisdictionsAPI;
  onChange: (data: Jurisdiction[]) => void;
}) {
  const { fetchJurisdictions, fetchSubJurisdictions } = useJurisdictionsAPI();
  const [jurisdictions, setJurisdictions] = useState<{
    [k: string]: Jurisdiction[];
  }>({});

  const [selectedJurisdictions, setSelected] = useState<Jurisdiction[]>([]);

  useEffect(() => {
    fetchJurisdictions().then((jurisdictions: Jurisdiction[]) => {
      setJurisdictions({ 0: jurisdictions });
    });
  }, [fetchJurisdictions]);

  const selectJurisdiction = (jurisdiction: Jurisdiction) => {
    setJurisdictions({ ...jurisdictions, ...{ [jurisdiction.id]: [] } });
    const newSelection = [...selectedJurisdictions, jurisdiction];
    onChange(newSelection);
    setSelected(newSelection);
    fetchSubJurisdictions(jurisdiction.id).then(
      (subjurisdictions: Jurisdiction[]) => {
        setJurisdictions({
          ...jurisdictions,
          ...{ [jurisdiction.id]: subjurisdictions },
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
              selectJurisdiction(jurisdiction);
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
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      selectJurisdiction(sub);
                    }}
                  >
                    {sub.name}
                    {jurisdictions[sub.id] && !jurisdictions[sub.id].length && (
                      <div>Loading {sub.name} ...</div>
                    )}

                    {jurisdictions[sub.id] &&
                      jurisdictions[sub.id].length &&
                      jurisdictions[sub.id].map((sub2) => {
                        return <div>{sub2.name}</div>;
                      })}
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
}

export default App;
