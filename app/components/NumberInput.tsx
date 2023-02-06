import { useField } from "formik";

export const NumberInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const [_0, { value }, { setValue }] = useField(name);

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input type="number" name={name} value={value} onChange={e => setValue(e.target.value)} />
    </>
  );
}