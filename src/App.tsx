import { useEffect, useId, useState } from "react";
import "./App.css";

export type Jurisdiction = {
  id: number;
  name: string;
  subjurisdictions?: Jurisdiction[];
};

type JurisdictionsAPI = {
  fetchJurisdictions: () => Promise<Jurisdiction[]>;
  fetchSubJurisdictions: (id: number) => Promise<Jurisdiction[]>;
};

function findJurisdictionRecursive(
  jurisdictions: Jurisdiction[],
  jurisdictionId: number
): Jurisdiction | null {
  for (const jurisdiction of jurisdictions) {
    if (jurisdiction.id === jurisdictionId) {
      return jurisdiction;
    }

    if (jurisdiction.subjurisdictions) {
      const found = findJurisdictionRecursive(
        jurisdiction.subjurisdictions,
        jurisdictionId
      );
      if (found) {
        return found;
      }
    }
  }

  return null;
}

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

function JurisdictionSelector({
  jurisdiction,
  onChange,
}: {
  jurisdiction: Jurisdiction;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    jurisdiction: Jurisdiction
  ) => void;
}) {
  return (
    <>
      <CheckBox
        label={jurisdiction.name}
        onChange={(e) => {
          onChange(e, jurisdiction);
        }}
      />
      {jurisdiction.subjurisdictions &&
        !jurisdiction.subjurisdictions.length && (
          <div>Loading {jurisdiction.name} ...</div>
        )}
      <ul>
        {jurisdiction.subjurisdictions &&
          jurisdiction.subjurisdictions.map((subjurisdiction) => (
            <li key={subjurisdiction.id}>
              <JurisdictionSelector
                jurisdiction={subjurisdiction}
                onChange={onChange}
              />
            </li>
          ))}
      </ul>
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

  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);

  const [selectedJurisdictions, setSelected] = useState<Jurisdiction[]>([]);

  useEffect(() => {
    fetchJurisdictions().then((jurisdictions: Jurisdiction[]) => {
      setJurisdictions(jurisdictions);
    });
  }, [fetchJurisdictions]);

  const onJurisdictionSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    jurisdiction: Jurisdiction
  ) => {
    let newSelection = [];
    if (!e.target.checked) {
      newSelection = selectedJurisdictions.filter(
        (j) => j.id !== jurisdiction.id
      );
    } else {
      newSelection = [
        ...selectedJurisdictions,
        { name: jurisdiction.name, id: jurisdiction.id },
      ];
    }
    onChange(newSelection);
    setSelected(newSelection);
    if (!jurisdiction.subjurisdictions) {
      setJurisdictions((jurisdictions) => {
        const parent = findJurisdictionRecursive(
          jurisdictions,
          jurisdiction.id
        );
        if (parent) {
          parent.subjurisdictions = [];
        }
        return [...jurisdictions];
      });
      fetchSubJurisdictions(jurisdiction.id).then(
        (subjurisdictions: Jurisdiction[]) => {
          if (parent) {
            setJurisdictions((jurisdictions) => {
              const parent = findJurisdictionRecursive(
                jurisdictions,
                jurisdiction.id
              );
              if (parent) {
                parent.subjurisdictions = subjurisdictions;
              }
              return [...jurisdictions];
            });
          }
        }
      );
    }
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
      <ul>
        {jurisdictions.map((jurisdiction) => {
          return (
            <li key={jurisdiction.id}>
              <JurisdictionSelector
                jurisdiction={jurisdiction}
                onChange={(e, jurisdiction) => {
                  onJurisdictionSelected(e, jurisdiction);
                }}
              />
            </li>
          );
        })}
      </ul>
      <div className="debug-selected">
        <pre>{"[\n" + selectedJurisdictions.map(j => '  ' + JSON.stringify(j)).join(',\n') + "\n]"}</pre>
      </div>
    </>
  );
}

export default App;
