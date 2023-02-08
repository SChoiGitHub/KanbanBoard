import { useController } from "react-hook-form";

export const NumberInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    shouldUnregister: true,
  });

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input ref={ref} type="number" name={name} value={value} onChange={onChange} />
    </>
  );
}