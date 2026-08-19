import { Edit, SimpleForm } from 'react-admin';
import { UserFormFields } from './UserFormFields';

export const UserEdit = () => {
  return (
    <Edit mutationMode="pessimistic">
      <SimpleForm>
        <UserFormFields />
      </SimpleForm>
    </Edit>
  );
};
