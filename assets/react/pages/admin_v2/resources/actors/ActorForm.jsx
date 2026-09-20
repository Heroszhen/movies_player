import { Box, Typography, Modal, Button } from '@mui/material';
import { useState } from 'react';
import { DateInput, required, SimpleForm, TextInput, useRecordContext, useUpdate } from 'react-admin';
import Editor from '../../../../components/editor/Editor';
import { getModalStyle } from '../../../../services/data';
import { wait } from '../../../../services/utils';
import { CustomToolbar } from '../common/CustomToolbar';
import { PhotoEdit } from '../common/PhotoEdit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { deletePhoto } from '../../../../stores/fileStore';

export const ActorForm = ({ isCreate, editorRef }) => {
  const record = useRecordContext();
  const DescriptionEditor = ({ editorRef }) => {
    return <Editor ref={editorRef} label="Description" value={record?.description} />;
  };

  const [update] = useUpdate();
  const [open, setOpen] = useState(false);

  const modifyPhoto = async (newPhoto) => {
    if (!record) return;
    if (newPhoto['@id']) {
      const oldPhotoId = record.currentPhoto?.id;
      await update('actors', {
        id: record.id,
        data: { currentPhoto: newPhoto['@id'] },
        previousData: record,
      });

      await wait(0.5);
      if (oldPhotoId) await deletePhoto(oldPhotoId);
    }
  };

  return (
    <>
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

      {record && record.currentPhoto && (
        <Box component="section" className="w-full p-3 mt-5">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            color="success"
            className="mb-3"
            onClick={() => setOpen(true)}></Button>
          <br />
          <img
            src={`${process.env.AWS_FILE_PREFIX}${record.currentPhoto.imageName}`}
            alt=""
            style={{ width: 300, height: 'auto', objectFit: 'cover', maxWidth: '100%' }}
          />
        </Box>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(500)}>
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 4 }}>
            Editer la photo
          </Typography>
          <PhotoEdit modifyPhoto={modifyPhoto} />
        </Box>
      </Modal>
    </>
  );
};
