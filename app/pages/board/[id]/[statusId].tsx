import { ErrorList } from "@/components/ErrorList";
import { useQueryBoard } from "@/components/Hooks";
import { NumberInput } from "@/components/NumberInput";
import { TextInput } from "@/components/TextInput";
import { gql } from "@/components/__gql__/gql";
import { useMutation } from "@apollo/client";
import { Formik, Form, useFormikContext } from "formik";
import { useRouter } from "next/router";
import { number, object, string } from "yup";

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

const StatusForm = () => {
  const { submitForm, errors } = useFormikContext();

  return (
    <Form>
      <TextInput name="title" labelText="Status Title" />
      <br />
      <p>A zero limit will be &quot;No Limit&quot;. A nonzero limit will be enforced.</p>
      <NumberInput name="limit" labelText="Maximum Number of Allowed Tasks" />
      <button type="submit" onClick={submitForm}>Submit</button>
      <ErrorList errors={errors} />
    </Form>
  );
}

const Schema = object({
  title: string()
    .required('Title is required.')
    .min(2, "The title is too short."),
  limit: number()
    .required('A limit value is required.')
    .min(0, 'Limit cannot be negative.')
    .integer(),
});

const Component = () => {
  const router = useRouter();
  const { statusId: statusIdAsString, id: idAsString } = router.query;
  const id = Number(idAsString);
  const statusId = Number(statusIdAsString);
  const { statuses } = useQueryBoard(id);
  const status = statuses.find(status => status && status.id === statusId);

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onCompleted: (data) => {
      if (data?.updateStatus) {
        router.push(`/board/${data.updateStatus.boardId}`);
      }
    },
  });

  if (!status) {
    return null;
  }
  const { title, limit } = status;

  return (
    <div>
      <h3>{status.title}</h3>
      <Formik
        initialValues={{
          title,
          limit: limit ?? 0,
        }}
        onSubmit={
          () => updateStatus({
            variables: {
              id: status.id,
              input: { title, limit }
            }
          })
        }
        validationSchema={Schema}
      >
        <StatusForm />
      </Formik>
    </div>
  );
}

export default Component;