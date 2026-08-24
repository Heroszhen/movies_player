import { Edit, SimpleForm } from 'react-admin';
import { UserFormFields } from './UserFormFields';

const transform = (data) => {
  // eslint-disable-next-line no-unused-vars
  const { photo, updatedAt, ...rest } = data;
  return rest;
};

export const UserEdit = () => {
  return (
    <Edit mutationMode="pessimistic" transform={transform}>
      <SimpleForm>
        <UserFormFields />
      </SimpleForm>
    </Edit>
  );
};
