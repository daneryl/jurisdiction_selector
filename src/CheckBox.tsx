import { useId } from "react";


export function CheckBox({
  label, onChange,
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

