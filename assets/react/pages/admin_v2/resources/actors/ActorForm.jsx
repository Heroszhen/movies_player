import { Box, Typography } from '@mui/material';
import { DateInput, required, SimpleForm, TextInput, useRecordContext } from 'react-admin';
import Editor from '../../../../components/editor/Editor';
import { CustomToolbar } from '../common/CustomToolbar';

export const ActorForm = ({ isCreate, editorRef }) => {
  const record = useRecordContext();
  const DescriptionEditor = ({ editorRef }) => {
    return <Editor ref={editorRef} label="Description" value={record?.description} />;
  };

  return (
    <SimpleForm toolbar={<CustomToolbar />}>
      <Typography variant="h5" gutterBottom>
        {isCreate ? 'Ajouter un acteur' : `Modifier l'acteur ${record.name}`}
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} width="100%">
        <TextInput source="name" type="text" label="Nom" validate={[required()]} />
        <TextInput source="country" type="text" label="Pays" validate={[required()]} />
        <DateInput source="birthday" type="date" label="Date de naissance" validate={[required()]} />
      </Box>
      <Box component="div" className="w-full">
        <DescriptionEditor editorRef={editorRef} />
      </Box>
    </SimpleForm>
  );
};
