import { useEffect, useReducer, useState } from "react";
import { JurisdictionSelector } from "./JurisdictionSelector";
import { Jurisdiction, SelectedJurisdiction } from "./types";
import { jurisdictionsReducer } from "./jurisdictionsReducer";

type JurisdictionsAPI = {
  fetchJurisdictions: () => Promise<{ id: number; name: string }[]>;
  fetchSubJurisdictions: (
    id: number
  ) => Promise<{ id: number; name: string }[]>;
};

function App({
  useJurisdictionsAPI,
  onChange,
}: {
  useJurisdictionsAPI: () => JurisdictionsAPI;
  onChange: (data: SelectedJurisdiction[]) => void;
}) {
  const { fetchJurisdictions, fetchSubJurisdictions } = useJurisdictionsAPI();
  const [state, dispatch] = useReducer(jurisdictionsReducer, {
    id: 0,
    name: "ROOT",
    loading: false,
    loaded: false,
    subjurisdictions: [],
  });
  const [selected, setSelected] = useState<SelectedJurisdiction[]>([]);

  useEffect(() => {
    fetchJurisdictions().then(
      (jurisdictions: { id: number; name: string }[]) => {
        dispatch({
          type: "update",
          jurisdiction: {
            id: 0,
            name: "ROOT",
            loading: false,
            loaded: true,
            subjurisdictions: jurisdictions.map((j) => ({
              ...j,
              loading: false,
              loaded: false,
              subjurisdictions: [],
            })),
          },
        });
      }
    );
  }, [fetchJurisdictions]);

  function changeSelected(
    e: React.ChangeEvent<HTMLInputElement>,
    jurisdiction: Jurisdiction
  ) {
    let newSelection: SelectedJurisdiction[] = [];
    if (!e.target.checked) {
      newSelection = selected.filter((j) => j.id !== jurisdiction.id);
    } else {
      newSelection = [
        ...selected,
        { name: jurisdiction.name, id: jurisdiction.id },
      ];
    }
    onChange(newSelection);
    setSelected(newSelection);
  }

  const onJurisdictionSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    jurisdiction: Jurisdiction
  ) => {
    changeSelected(e, jurisdiction);
    if (!jurisdiction.loaded) {
      dispatch({
        type: "update",
        jurisdiction: { ...jurisdiction, loading: true },
      });
      fetchSubJurisdictions(jurisdiction.id).then(
        (subjurisdictions: { id: number; name: string }[]) => {
          dispatch({
            type: "update",
            jurisdiction: {
              ...jurisdiction,
              subjurisdictions: subjurisdictions.map((j) => ({
                ...j,
                loaded: false,
                loading: false,
                subjurisdictions: []
              })),
              loaded: true,
              loading: false,
            },
          });
        }
      );
    }
  };

  if (!state.loaded) {
    return (
      <>
        <div>Loading ...</div>
      </>
    );
  }

  return (
    <>
      <ul>
        {state.subjurisdictions.map((jurisdiction) => {
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
            selected.map((j) => "  " + JSON.stringify(j)).join(",\n") +
            "\n]"}
        </pre>
      </div>
    </>
  );
}

export default App;
