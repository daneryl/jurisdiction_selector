import { useEffect, useId, useState } from "react";
import "./App.css";

export type Jurisdiction = {
  id: number;
  name: string;
  loading: boolean;
  subjurisdictions?: Jurisdiction[];
};

export type SelectedJurisdiction = {
  id: number;
  name: string;
};

type JurisdictionsAPI = {
  fetchJurisdictions: () => Promise<{ id: number; name: string }[]>;
  fetchSubJurisdictions: (
    id: number
  ) => Promise<{ id: number; name: string }[]>;
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
  let label = jurisdiction.name;
  if (jurisdiction.loading) {
    label = `${jurisdiction.name}...`;
  }
  return (
    <>
      <CheckBox
        label={label}
        onChange={(e) => {
          onChange(e, jurisdiction);
        }}
      />
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
  onChange: (data: SelectedJurisdiction[]) => void;
}) {
  const { fetchJurisdictions, fetchSubJurisdictions } = useJurisdictionsAPI();

  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);

  const [selectedJurisdictions, setSelected] = useState<SelectedJurisdiction[]>(
    []
  );

  useEffect(() => {
    fetchJurisdictions().then(
      (jurisdictions: { id: number; name: string }[]) => {
        setJurisdictions(
          jurisdictions.map((j) => Object.assign(j, { loading: false }))
        );
      }
    );
  }, [fetchJurisdictions]);

  const onJurisdictionSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    jurisdiction: Jurisdiction
  ) => {
    let newSelection: SelectedJurisdiction[] = [];
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
          parent.loading = true;
        }
        return [...jurisdictions];
      });
      fetchSubJurisdictions(jurisdiction.id).then(
        (subjurisdictions: { id: number; name: string }[]) => {
          if (parent) {
            setJurisdictions((jurisdictions) => {
              const parent = findJurisdictionRecursive(
                jurisdictions,
                jurisdiction.id
              );
              if (parent) {
                parent.loading = false;
                parent.subjurisdictions = subjurisdictions.map((j) =>
                  Object.assign(j, { loading: false })
                );
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
        <pre>
          {"[\n" +
            selectedJurisdictions
              .map((j) => "  " + JSON.stringify(j))
              .join(",\n") +
            "\n]"}
        </pre>
      </div>
    </>
  );
}

export default App;
