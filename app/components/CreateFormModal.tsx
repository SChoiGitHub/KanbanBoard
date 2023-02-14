
import { gql } from "@/components/__gql__";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { TextInput } from "@/components/TextInput";
import { FormProvider, useForm, useFormContext, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateFormSchema } from "@/components/CreateFormSchema";
import { CenterModal } from "./CenterModal";
import { ErrorMessage } from '@hookform/error-message';

const StatusesInput = () => {
  const { formState: { isSubmitting, errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "statuses" });
  const removeLastStatus = () => remove(-1);
  const addBlankStatus = () => append({ name: '' });

  return (
    <>
      <button type="button" onClick={addBlankStatus} disabled={isSubmitting}>
        Add Status
      </button>
      <button type="button" disabled={isSubmitting || fields.length == 1} onClick={removeLastStatus}>
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
      <ErrorMessage errors={errors} name="statuses" render={({ message }) => <p>{message}</p>} />
    </>
  )

};

const CREATE_BOARD = gql(/* GraphQL */`
  mutation createBoard($name: String!, $statuses: [String!]!) {
    createBoard(input: { name: $name, statuses: $statuses }) {
      id
      name
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
    },
    update: (cache, { data }, { variables }) => {
      const reference = cache.writeQuery({
        query: CREATE_BOARD,
        data,
        variables,
      });
      cache.modify({
        fields: {
          allBoards: (prev) => [...prev, reference],
        }
      })
    },
  });
  const methods = useForm<FormType>({
    defaultValues: {
      name: '',
      statuses: [{ name: '' }],
    },
    resolver: zodResolver(CreateFormSchema),
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
      </FormProvider>
    </CenterModal>
  );
}