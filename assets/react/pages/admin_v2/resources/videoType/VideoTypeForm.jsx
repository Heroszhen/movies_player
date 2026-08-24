import { required, SimpleForm, TextInput } from 'react-admin';
import { CustomToolbar } from '../common/CustomToolbar';

export const VideoTypeForm = () => {
  return (
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput source="name" type="text" label="Nom" validate={[required()]} />
    </SimpleForm>
  );
};
