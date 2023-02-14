import { useFormContext } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

export const TextInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const { register, formState: { errors } } = useFormContext();
  const { ref, onChange } = register(name, { shouldUnregister: true });

  return (
    <>
      <label htmlFor={name}>{labelText}</label>
      <input ref={ref} name={name} onChange={onChange} />
      <ErrorMessage errors={errors} name={name} render={({ message }) => <p>{message}</p>}/>
    </>
  );
}