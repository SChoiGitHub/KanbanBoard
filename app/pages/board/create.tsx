
import { gql } from "@/components/__gql__";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { TextInput } from "@/components/TextInput";
import { ErrorList } from "@/components/ErrorList";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateFormSchema } from "@/components/CreateFormSchema";

const StatusesInput = () => {
  const { formState: { isSubmitting }, unregister } = useFormContext();
  const [length, setLength] = useState(1);
  const removeLastStatus = () => {
    unregister(['statuses.1'])
    setLength(length - 1)
  };
  const addBlankStatus = () => setLength(length + 1);

  return (
    <>
      <button type="button" onClick={addBlankStatus} disabled={isSubmitting}>
        Add Status
      </button>
      <button type="button" disabled={isSubmitting || length == 1} onClick={removeLastStatus}>
        Remove Status
      </button>
      <div>
        {
          Array.from(Array(length).keys()).map((_0, x) => {
            return (<TextInput key={x} name={`statuses.${x}`} labelText={`Status #${x + 1}`} />);
          })
        }
      </div>
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

const Create = () => {
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
      statuses: ['Test'],
    },
    resolver: zodResolver(CreateFormSchema), 
    shouldUnregister: true 
  });

  return (
    <FormProvider {...methods}>
      <TextInput name="name" labelText="Board Name" />
      <StatusesInput />
      <button type="submit" onClick={methods.handleSubmit((values) => createBoard({ variables: values }))}>Submit</button>
      <ErrorList errors={methods.formState.errors} />
    </FormProvider>
  );
}

export default Create;