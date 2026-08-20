import { Edit, SimpleForm } from 'react-admin';
import { UserFormFields } from './UserFormFields';

const transform = (data) => {
  const { photo, ...rest } = data;
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
