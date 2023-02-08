import { ErrorList } from "@/components/ErrorList";
import { NumberInput } from "@/components/NumberInput";
import { TextInput } from "@/components/TextInput";
import { gql } from "@/components/__gql__/gql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Modal } from "@mui/material";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Status } from "./__gql__/graphql";

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

const Form = ({ title, id, limit, onClose }: { title: string, id: number, limit?: number | null, onClose: () => any }) => {
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
        onClose();
      }
    },
  });

  return (
    <Box sx={{ margin: "16px" }}>
      <h3>{title}</h3>
      <FormProvider {...methods}>
        <TextInput name="title" labelText="Status Title" />
        <br />
        <NumberInput name="limit" labelText="Maximum Number of Allowed Tasks" tooltip="A zero limit will be &quot;No Limit&quot;. A nonzero limit will be enforced." />
        <button type="submit" disabled={methods.formState.isSubmitting} onClick={methods.handleSubmit(
          (values) => updateStatus({
            variables: { id, input: values }
          }))}>Submit</button>
        <ErrorList errors={methods.formState.errors} />
      </FormProvider>
    </Box>
  )
}

type Props = { status?: Pick<Status, 'id' | 'title' | 'limit'>, open: boolean, onClose: () => any };
export const EditStatusModal = ({ status, open, onClose }: Props) => {
  const { id, title, limit } = status ?? { id: -1, title: '', limit: 0 };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ background: "#FFFFFF", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', position: 'absolute' }}>
        <Form
          id={id}
          title={title}
          limit={limit}
          onClose={onClose}
        />
      </Box>
    </Modal>
  );
}