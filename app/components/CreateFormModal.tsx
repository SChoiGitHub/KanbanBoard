
import { gql } from "@/components/__gql__";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { TextInput } from "@/components/TextInput";
import { ErrorList } from "@/components/ErrorList";
import { FormProvider, useForm, useFormContext, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateFormSchema } from "@/components/CreateFormSchema";
import { CenterModal } from "./CenterModal";

const StatusesInput = () => {
  const { formState: { isSubmitting } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "statuses" });
  const removeLastStatus = () => remove(-1);
  const addBlankStatus = () => append({ name: '' });


  return (
    <>
      <button type="button" onClick={addBlankStatus} disabled={isSubmitting}>
        Add Status
      </button>
      <button type="button" disabled={isSubmitting || length == 1} onClick={removeLastStatus}>
        Remove Status
      </button>
      <ol>
        {
          fields.map(({ id }, index) => {
            return (
              <li key={id}>
                <TextInput name={`statuses.${index}.name`} labelText="Status:" />
              </li>
            );
          })
        }
      </ol>
    </>
  )

};

const CREATE_BOARD = gql(/* GraphQL */`
  mutation createBoard($name: String!, $statuses: [String!]!) {
    createBoard(input: { name: $name, statuses: $statuses }) {
      id
    }
  }`);

type FormType = z.infer<typeof CreateFormSchema>;

type Props = { open: boolean, onClose: () => any };
export const CreateFormModal = ({ open, onClose }: Props) => {
  const router = useRouter();
  const [createBoard] = useMutation(CREATE_BOARD, {
    onCompleted: ({ createBoard }) => {
      if (createBoard) {
        router.push(`/board/${createBoard.id}`);
      }
    }
  });
  const methods = useForm<FormType>({
    defaultValues: {
      name: '',
      statuses: [{ name: '' }],
    },
    resolver: (a, b, c) => {
      console.log(a, b, c);

      return zodResolver(CreateFormSchema)(a, b, c);
    },
    shouldUnregister: true
  });

  const onSubmit: SubmitHandler<FormType> = (values) => {
    createBoard({
      variables: {
        name: values.name,
        statuses: values.statuses.map(({ name }) => name),
      }
    });
  };

  return (
    <CenterModal
      open={open}
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <TextInput name="name" labelText="Board Name" />
        <StatusesInput />
        <button type="submit" onClick={methods.handleSubmit(onSubmit)}>Submit</button>
        <ErrorList errors={methods.formState.errors} />
      </FormProvider>
    </CenterModal>
  );
}