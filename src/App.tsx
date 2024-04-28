import { useEffect, useId, useState } from "react";
import "./App.css";

export type Jurisdiction = {
  id: number;
  name: string;
};

type JurisdictionsAPI = {
  fetchJurisdictions: () => Promise<Jurisdiction[]>;
  fetchSubJurisdictions: (id: number) => Promise<Jurisdiction[]>;
};

function CheckBox({
  label,
  onChange,
}: {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const uniqueId = useId();
  return (
    <>
      <input type="checkbox" id={uniqueId} onChange={onChange} />
      <label htmlFor={uniqueId}>{label}</label>
    </>
  );
}

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

  const onJurisdictionSelected = (jurisdiction: Jurisdiction) => {
    const newSelection = [...selectedJurisdictions, jurisdiction];
    onChange(newSelection);
    setSelected(newSelection);
    setJurisdictions({ ...jurisdictions, ...{ [jurisdiction.id]: [] } });
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
          <div>
            <CheckBox
              label={jurisdiction.name}
              onChange={() => {
                onJurisdictionSelected(jurisdiction);
              }}
            />
            {jurisdictions[jurisdiction.id] &&
              !jurisdictions[jurisdiction.id].length && (
                <div>Loading {jurisdiction.name} ...</div>
              )}

            {jurisdictions[jurisdiction.id] &&
              jurisdictions[jurisdiction.id].length &&
              jurisdictions[jurisdiction.id].map((sub) => {
                return (
                  <div>
                    <CheckBox
                      label={sub.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        onJurisdictionSelected(sub);
                      }}
                    />
                    {jurisdictions[sub.id] && !jurisdictions[sub.id].length && (
                      <div>Loading {sub.name} ...</div>
                    )}

                    {jurisdictions[sub.id] &&
                      jurisdictions[sub.id].length &&
                      jurisdictions[sub.id].map((sub2) => {
                        return (
                          <CheckBox
                            label={sub2.name}
                            // onChange={(e) => {
                            //   e.stopPropagation();
                            //   onJurisdictionSelected(sub);
                            // }}
                          />
                        );
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
