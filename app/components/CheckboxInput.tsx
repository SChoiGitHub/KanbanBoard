import { Checkbox, FormControlLabel } from "@mui/material";
import { useController, useWatch } from "react-hook-form";

export const CheckboxInput = ({ name, labelText }: { name: string, labelText: string }) => {
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    shouldUnregister: true,
    defaultValue: false,
  });

  return (
    <FormControlLabel control={<Checkbox 
      ref={ref}
      checked={value}
      onChange={onChange}
    />} label={labelText} />
  );
}