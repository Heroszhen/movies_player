import { Create, SimpleForm } from 'react-admin';
import { UserFormFields } from './UserFormFields';

export const UserCreate = () => {
  return (
    <>
      <Create>
        <SimpleForm>
          <UserFormFields isCreate />
        </SimpleForm>
      </Create>
    </>
  );
};
