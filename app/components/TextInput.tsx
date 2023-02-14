import { useFormContext, GlobalError, get } from "react-hook-form";

export const TextInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const { register, formState: { errors } } = useFormContext();
  const { ref, onChange } = register(name, { shouldUnregister: true });
  const { message } = get(errors, name) as GlobalError;

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input ref={ref} name={name} onChange={onChange} />
      {message && (<p>{message}</p>)}
    </>
  );
}