import { useController, useFormContext } from "react-hook-form";

export const TextInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    shouldUnregister: true,
  });

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input ref={ref} name={name} value={value} onChange={onChange} />
    </>
  );
}