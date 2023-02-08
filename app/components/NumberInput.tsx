import { Tooltip } from "@mui/material";
import { useController } from "react-hook-form";

export const NumberInput = ({ name, labelText, tooltip }: { name: string, labelText: string, tooltip?: string }) => {
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    shouldUnregister: true,
  });

  return (
    <div>
      <Tooltip title={tooltip}>
        <label htmlFor={name}>{labelText}</label>
      </Tooltip>
      <input ref={ref} type="number" name={name} value={value} onChange={onChange} />
    </div>
  );
}