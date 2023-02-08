import { ErrorList } from "@/components/ErrorList";
import { useQueryBoard } from "@/components/Hooks";
import { NumberInput } from "@/components/NumberInput";
import { TextInput } from "@/components/TextInput";
import { gql } from "@/components/__gql__/gql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const UPDATE_STATUS = gql(/* GraphQL */`
  mutation updateStatus($id: Int!, $input: UpdateStatusInput!) {
    updateStatus(id: $id, newValues: $input) {
      id
      boardId
      title
      limit
    }
  }
`);

const Schema = z.object({
  title: z.string({ required_error: "A title is required" })
    .min(2, "The title is too short."),
  limit: z.number({ required_error: "A limit value is required" })
    .min(0, 'Limit cannot be negative.')
    .int(),
});

type FormType = z.infer<typeof Schema>;

const Form = ({ title, id, limit }: { title: string, id: number, limit?: number|null}) => {
  const router = useRouter();
  const methods = useForm<FormType>({ 
    defaultValues: {
      title,
      limit: limit ?? 0
    },
    shouldUnregister: true,
    resolver: zodResolver(Schema) 
  });
  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: (data) => {
      if (data?.updateStatus) {
        router.push(`/board/${data.updateStatus.boardId}`);
      }
    },
  });

  return ( 
    <div>
      <h3>{title}</h3>
      <FormProvider {...methods}>
        <TextInput name="title" labelText="Status Title" />
        <br />
        <p>A zero limit will be &quot;No Limit&quot;. A nonzero limit will be enforced.</p>
        <NumberInput name="limit" labelText="Maximum Number of Allowed Tasks" />
        <button type="submit" onClick={methods.handleSubmit(
          (values) => updateStatus({
            variables: {  id, input: values }
          }))}>Submit</button>
        <ErrorList errors={methods.formState.errors} />
      </FormProvider>
    </div>
  )
}

const Component = () => {
  const router = useRouter();
  const { statusId: statusIdAsString, id: idAsString } = router.query;
  const id = Number(idAsString);
  const statusId = Number(statusIdAsString);
  const { statuses } = useQueryBoard(id);
  const status = statuses.find(status => status && status.id === statusId);
  if (!status) {
    return null;
  }

  const { title, limit } = status;

  return (<Form
    id={status.id}
    title={title}
    limit={limit}
  />);
}

export default Component;