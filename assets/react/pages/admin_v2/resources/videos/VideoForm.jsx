import { Box, Modal, Typography, Button } from '@mui/material';
import {
  AutocompleteArrayInput,
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import { getModalStyle } from '../../../../services/data';
import { VideoPhotoEdit } from './VideoPhotoEdit';

const DescriptionEditor = ({ editorRef, record }) => {
  return <Editor ref={editorRef} label="Description" value={record?.description} />;
};

const VideoToolbar = ({ navigate, videoId }) => (
  <Toolbar className="flex justify-between">
    <SaveButton alwaysEnable />
    {videoId && (
      <NavLink to={`/video/${videoId}`} className="mb-1" target="_blank">
        <PreviewIcon />
      </NavLink>
    )}
    <Button onClick={() => navigate(-1)}>Retour</Button>
  </Toolbar>
);

export const VideoForm = ({ isCreate, editorRef }) => {
  const record = useRecordContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <SimpleForm toolbar={<VideoToolbar navigate={navigate} videoId={record?.id} />}>
        <Typography variant="h5" gutterBottom>
          {isCreate ? 'Ajouter une vidéo' : `Modifier la vidéo ${record?.title}`}
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
            <AutocompleteArrayInput
              optionText="name"
              label="Acteurs"
              validate={[required()]}
              fullWidth
              filterToQuery={(searchText) => ({ name: searchText })}
            />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            source="categories"
            reference="categories"
            perPage={999}
            sort={{ field: 'name', order: 'ASC' }}>
            <AutocompleteArrayInput
              optionText="name"
              label="Catégories"
              validate={[required()]}
              fullWidth
              filterToQuery={(searchText) => ({ name: searchText })}
            />
          </ReferenceArrayInput>
        </Box>
        <TextInput multiline rows={3} source="link" label="Lien" validate={[required()]} />
        <TextInput multiline rows={2} source="url" label="Url de la page" />
        <Box component="div" className="w-full">
          <DescriptionEditor editorRef={editorRef} record={record} />
        </Box>
      </SimpleForm>

      {record && (
        <Box component="section" className="w-full p-3 mt-3">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            color="success"
            className="mb-3 ms-2"
            onClick={() => setOpen(true)}></Button>
          <br />
          {record.poster && (
            <img
              src={`${process.env.AWS_FILE_PREFIX}${record.poster.imageName}`}
              alt=""
              style={{ width: 300, height: 'auto', objectFit: 'cover', maxWidth: '100%' }}
            />
          )}
        </Box>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(500)}>
          <VideoPhotoEdit video={record} />
        </Box>
      </Modal>
    </>
  );
};
