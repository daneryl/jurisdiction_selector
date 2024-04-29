import { Jurisdiction } from "./types";

function updateJurisdictionRecursively(
  node: Jurisdiction,
  jurisdiction: Jurisdiction
): Jurisdiction {
  if (node.id === jurisdiction.id) {
    return { ...jurisdiction };
  }

  const updatedChildren = node.subjurisdictions.map((child) =>
    updateJurisdictionRecursively(child, jurisdiction)
  );

  return {
    ...node,
    subjurisdictions: updatedChildren,
  };
}
export const jurisdictionsReducer = (
  state: Jurisdiction,
  action: { type: string; jurisdiction: Jurisdiction }
) => {
  switch (action.type) {
    case "update":
      return updateJurisdictionRecursively(state, action.jurisdiction);
    default:
      return state;
  }
};
