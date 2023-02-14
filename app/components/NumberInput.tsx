import { Tooltip } from "@mui/material";
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from "react-hook-form";

export const NumberInput = ({ name, labelText, tooltip }: { name: string, labelText: string, tooltip?: string }) => {
  const { register, formState: { errors } } = useFormContext();
  const { ref, onChange } = register(name, { shouldUnregister: true, valueAsNumber: true });

  return (
    <div>
      <Tooltip title={tooltip}>
        <label htmlFor={name}>{labelText}</label>
      </Tooltip>
      <input ref={ref} type="number" name={name} onChange={onChange} />
      <ErrorMessage errors={errors} name={name} render={({ message }) => <p>{message}</p>} />
    </div>
  );
}