import { NumberInput } from "@/components/NumberInput";
import { TextInput } from "@/components/TextInput";
import { gql } from "@/components/__gql__/gql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { CenterModal } from "./CenterModal";
import { CheckboxInput } from "./CheckboxInput";
import { EditStatusSchema } from "./EditStatusSchema";
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

type FormType = z.infer<typeof EditStatusSchema>;

const Form = ({ title, id, limit, onClose }: { title: string, id: number, limit?: number | null, onClose: () => any }) => {
  const defaultValues = (limit && limit > 0)
    ? { title, hasLimit: true, limit }
    : { title, hasLimit: false };

  const methods = useForm<FormType>({
    defaultValues,
    shouldUnregister: true,
    resolver: zodResolver(EditStatusSchema)
  });
  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: (data) => {
      if (data?.updateStatus) {
        onClose();
      }
    },
  });

  const onSubmit = (values: FormType) => {
    const limit = values.hasLimit ? values.limit : 0;
    const title = values.title;

    updateStatus({ variables: { id, input: { title, limit } } });
  };

  methods.watch('hasLimit');
  const hasLimit = methods.getValues('hasLimit');

  return (
    <>
      <h3>{title}</h3>
      <FormProvider {...methods}>
        <TextInput name="title" labelText="Status Title" />
        <br />
        <CheckboxInput name="hasLimit" labelText="Does this status have WIP Limit?" />
        <br />
        {
          hasLimit && (<NumberInput name="limit" labelText="Limit" />)
        }
        <br />
        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
        >
          Submit
        </button>
        <br />
      </FormProvider>
    </>
  )
}

type Props = { status?: Pick<Status, 'id' | 'title' | 'limit'>, open: boolean, onClose: () => any };
export const EditStatusModal = ({ status, open, onClose }: Props) => {
  const { id, title, limit } = status ?? { id: -1, title: '', limit: 0 };

  return (
    <CenterModal open={open} onClose={onClose}>
      <Form
        id={id}
        title={title}
        limit={limit}
        onClose={onClose}
      />
    </CenterModal>
  );
}