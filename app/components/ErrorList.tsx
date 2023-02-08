import { useEffect } from "react";

export const ErrorList = ({ errors }: { errors: Object }) => {
  if (Object.entries(errors).length == 0) {
    return null;
  }


  return (
    <div>
      <h5>Errors</h5>
      <ul>
        {
          Object.values(errors)
            .flatMap(v => Array.isArray(v) ? v : [v])
            .map((v, i) => (<li key={i}>{v.message}</li>))
        }
      </ul>
    </div>
  );
}