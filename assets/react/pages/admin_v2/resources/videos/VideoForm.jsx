import { Box, Typography } from '@mui/material';
import {
  AutocompleteArrayInput,
  Button,
  DateInput,
  maxLength,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from 'react-admin';
import Editor from '../../../../components/editor/Editor';
import { NavLink, useNavigate } from 'react-router-dom';
import PreviewIcon from '@mui/icons-material/Preview';

const DescriptionEditor = ({ editorRef }) => {
  const record = useRecordContext();
  return <Editor ref={editorRef} label="Description" value={record?.description} />;
};

const VideoToolbar = ({ navigate, videoId }) => (
  <Toolbar className="flex justify-between">
    <SaveButton alwaysEnable />
    <NavLink to={`/video/${videoId}`} className="mb-1" target="_blank">
      <PreviewIcon />
    </NavLink>
    <Button onClick={() => navigate(-1)}>Retour</Button>
  </Toolbar>
);

export const VideoForm = ({ isCreate, editorRef }) => {
  const record = useRecordContext();
  const navigate = useNavigate();

  return (
    <SimpleForm toolbar={<VideoToolbar navigate={navigate} videoId={record.id} />}>
      <Typography variant="h5" gutterBottom>
        {isCreate ? 'Ajouter une vidéo' : `Modifier la vidéo ${record.title}`}
      </Typography>

      <TextInput source="title" type="text" label="Titre" validate={[required(), maxLength(255)]} />
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} width="100%">
        <DateInput
          source="releasedAt"
          type="date"
          label="Date de sortie"
          validate={[required()]}
          defaultValue={isCreate ? new Date() : undefined}
        />
        <NumberInput
          source="duration"
          type="number"
          label="Durée"
          validate={[required()]}
          defaultValue={isCreate ? 1 : undefined}
        />
        <ReferenceInput source="type" reference="video_types">
          <SelectInput optionText="name" label="Type" validate={[required()]} />
        </ReferenceInput>
      </Box>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} width="100%">
        <ReferenceArrayInput source="actors" reference="actors" perPage={999} sort={{ field: 'name', order: 'ASC' }}>
          <AutocompleteArrayInput optionText="name" label="Acteurs" validate={[required()]} fullWidth />
        </ReferenceArrayInput>
        <ReferenceArrayInput
          source="categories"
          reference="categories"
          perPage={999}
          sort={{ field: 'name', order: 'ASC' }}>
          <AutocompleteArrayInput optionText="name" label="Catégories" validate={[required()]} fullWidth />
        </ReferenceArrayInput>
      </Box>
      <TextInput multiline rows={3} source="link" label="Lien" validate={[required()]} />
      <TextInput multiline rows={2} source="url" label="Url de la page" />
      <Box component="div" className="w-full">
        <DescriptionEditor editorRef={editorRef} />
      </Box>
    </SimpleForm>
  );
};
