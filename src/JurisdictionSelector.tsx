import { Jurisdiction } from "./types";
import { CheckBox } from "./CheckBox";

export function JurisdictionSelector({
  jurisdiction, onChange,
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
        }} />
      <ul>
        {jurisdiction.subjurisdictions &&
          jurisdiction.subjurisdictions.map((subjurisdiction) => (
            <li key={subjurisdiction.id}>
              <JurisdictionSelector
                jurisdiction={subjurisdiction}
                onChange={onChange} />
            </li>
          ))}
      </ul>
    </>
  );
}

