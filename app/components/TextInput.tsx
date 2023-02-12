import { useFormContext } from "react-hook-form";

export const TextInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const { register } = useFormContext();
  const { ref, onChange } = register(name, { shouldUnregister: true });

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input ref={ref} name={name} onChange={onChange} />
    </>
  );
}