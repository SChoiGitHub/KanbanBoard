import { useField } from "formik";

export const TextInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const [_0, { value }, { setValue }] = useField(name);

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input name={name} value={value} onChange={e => setValue(e.target.value)} />
    </>
  );
}