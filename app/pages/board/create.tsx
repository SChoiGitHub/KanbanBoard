
import { gql } from "@/components/__gql__";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useFormikContext, Formik, Form, useField } from 'formik';
import * as yup from 'yup';
import { TextInput } from "@/components/TextInput";
import { ErrorList } from "@/components/ErrorList";

type FormType = {
  name: string,
  statuses: string[],
}

const StatusesInput = ({ name }: { name: string }) => {
  const { isSubmitting } = useFormikContext();
  const [_0, { value }, { setValue }] = useField<string[]>(name);
  const removeLastStatus = () => setValue(value.slice(0, -1));
  const addBlankStatus = () => setValue([...value, '']);
  const changeStatusAtIndex = (newStatus: string, index: number) => {
    const newStatuses = [...value];
    newStatuses[index] = newStatus;
    setValue(newStatuses);
  };

  return (
    <>
      <button type="button" onClick={addBlankStatus} disabled={isSubmitting}>
        Add Status
      </button>
      <button type="button" disabled={isSubmitting || value.length == 1} onClick={removeLastStatus}>
        Remove Status
      </button>
      <div>
        {
          value.map((status, index) => (
            <div key={index}>
              <label htmlFor="name">Status #{index + 1}</label>
              <input name="name" value={status} onChange={e => changeStatusAtIndex(e.target.value, index)} />
            </div>
          ))
        }
      </div>
    </>
  )

};

const CreateForm = () => {
  const { submitForm, errors } = useFormikContext<FormType>();

  return (
    <Form>
      <TextInput name="name" labelText="Board Name" />
      <StatusesInput name="statuses" />
      <button type="submit" onClick={submitForm}>Submit</button>
      <ErrorList errors={errors} />
    </Form>
  );
}

const CREATE_BOARD = gql(/* GraphQL */`
  mutation createBoard($name: String!, $statuses: [String!]!) {
    createBoard(input: { name: $name, statuses: $statuses }) {
      id
    }
  }`);



const Schema = yup.object().shape({
  name: yup.string()
    .min(2, 'Invalid Board Name')
    .required('Board Name is required'),
  statuses: yup.array().of(
    yup.string().min(2, 'Invalid Status Description')
  ).length(1, "You require at least one status.")
});

const Create = () => {
  const router = useRouter();
  const [createBoard, { data, loading }] = useMutation(CREATE_BOARD, {
    onCompleted: ({ createBoard }) => {
      if (createBoard) {
        router.push(`/board/${createBoard.id}`);
      }
    }
  });

  return (
    <Formik
      initialValues={{
        name: "a",
        statuses: ['First Status'],
      }}
      onSubmit={({ name, statuses }, helpers) => {
        helpers.setSubmitting(true);
        createBoard({
          variables: {
            name,
            statuses
          }
        }).then(() => helpers.setSubmitting(false));
      }}
      validationSchema={Schema}
    >
      <CreateForm />
    </Formik>
  );
}

export default Create;