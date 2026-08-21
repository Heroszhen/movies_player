import { required, SimpleForm, TextInput } from 'react-admin';
import { CustomToolbar } from '../common/CustomToolbar';

export const CategoryForm = () => {
  return (
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput source="name" type="text" label="Nom" validate={[required()]} />
    </SimpleForm>
  );
};
