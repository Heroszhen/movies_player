import {
  Button,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  NumberField,
  Pagination,
  TextField,
  TextInput,
  useUpdate,
} from 'react-admin';
import PhotoIcon from '@mui/icons-material/Photo';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useState } from 'react';
import { Box, Grid, Input, LinearProgress, Modal, Typography } from '@mui/material';
import { getModalStyle } from '../../../../services/data';
import { PhotoEdit } from '../common/PhotoEdit';
import { deletePhoto, addFile, getPhotoByActorId } from '../../../../stores/fileStore';
import { wait } from '../../../../services/utils';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const ActorList = () => {
  const filters = [
    <TextInput source="name" label="Rechercher par nom" alwaysOn key="name" />,
    <TextInput source="country" label="Rechercher par pays" alwaysOn key="country" />,
  ];
  const [actorToModify, setActorToModify] = useState(null);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [update] = useUpdate();
  const [photosToUpload, setPhotosToUpload] = useState([]);
  const [actorPhotos, setActorPhotos] = useState([]);
  const [progress, setProgress] = useState(0);

  const toggleModal = async (newFormType = null, actor = null) => {
    setActorToModify(actor);
    setFormType(newFormType);
    if (newFormType === null) {
      setOpen(false);
      return;
    }
    setOpen(true);

    if (newFormType === 2) {
      setActorPhotos([]);
      setProgress(0);
      setPhotosToUpload([]);
      setActorPhotos(await getPhotoByActorId(actor.id));
    }
  };

  const modifyPhoto = async (newPhoto) => {
    if (newPhoto['@id']) {
      const oldPhotoId = actorToModify?.currentPhoto?.id;
      await update('actors', {
        id: actorToModify.id,
        data: { currentPhoto: newPhoto['@id'] },
        previousData: actorToModify,
      });

      await wait(0.5);
      if (oldPhotoId) await deletePhoto(oldPhotoId);
    }
  };

  const handleActorPhotos = (e) => {
    const files = e.target.files;
    const newFiles = [];
    for (let i = files.length - 1; i >= 0; i--) {
      newFiles.unshift(files.item(i));
    }
    setPhotosToUpload((prev) => [...newFiles, ...prev]);
    setProgress(0);
  };

  const sendNewPhotos = async () => {
    const options = { actorId: actorToModify.id };
    for (let i = 0; i < photosToUpload.length; i++) {
      setProgress(Math.round(((i + 1) / photosToUpload.length) * 100));
      const photo = await addFile(photosToUpload[i], options);
      setActorPhotos((prev) => [...prev, photo]);
    }

    setPhotosToUpload([]);
  };

  const deleteOldPhoto = async (index) => {
    await deletePhoto(actorPhotos[index].id);
    setActorPhotos((prev) => prev.filter((_, prevIndex) => prevIndex !== index));
  };

  return (
    <>
      <List perPage={20} filters={filters} pagination={<Pagination rowsPerPageOptions={[]} />}>
        <Datagrid rowClick={false}>
          <NumberField source="id" />
          <TextField source="name" />
          <FunctionField
            label="Photo"
            render={(record) =>
              record.currentPhoto ? (
                <img
                  src={`${process.env.AWS_FILE_PREFIX}${record.currentPhoto.imageName}`}
                  alt=""
                  style={{ width: 100, height: 'auto', objectFit: 'cover' }}
                />
              ) : null
            }
          />
          <TextField source="country" />
          <FunctionField
            label="Actions"
            render={(record) => (
              <>
                <EditButton className="me-1" />
                <PhotoIcon className="cursor-pointer me-1" onClick={() => toggleModal(1, record)} />
                <CollectionsIcon className="cursor-pointer me-1" onClick={() => toggleModal(2, record)} />
              </>
            )}
          />
        </Datagrid>
      </List>

      <Modal
        open={open}
        onClose={() => toggleModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(formType === 1 ? 500 : '90%')}>
          {formType === 1 && (
            <>
              <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 4 }}>
                Editer la photo de {actorToModify?.name}
              </Typography>
              <PhotoEdit modifyPhoto={modifyPhoto} />
            </>
          )}
          {formType === 2 && (
            <>
              <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 4 }}>
                Editer les photos de {actorToModify?.name}
              </Typography>
              <Box component="section" className="mb-3">
                <Input
                  onChange={(e) => handleActorPhotos(e)}
                  type="file"
                  id="upload-photos"
                  inputProps={{ accept: 'image/*', multiple: true }}
                  fullWidth="true"
                  className="mb-2"
                />
                <Button
                  variant="contained"
                  type="button"
                  disabled={photosToUpload.length === 0}
                  sx={{ mb: 2 }}
                  onClick={() => sendNewPhotos()}>
                  Envoyer
                </Button>
              </Box>

              {photosToUpload.length > 0 && (
                <>
                  <Typography variant="h5">Les nouvelles photos</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', mb: 3 }}>
                      <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                  </Box>
                  <Box component="section" className="mb-5 d-flex" sx={{ overflowY: 'auto' }}>
                    {photosToUpload.map((file, index) => {
                      return (
                        <span className="pe-3" key={index}>
                          <img src={URL.createObjectURL(file)} alt="" style={{ width: 400 + 'px' }} />
                          <DeleteForeverIcon
                            onClick={() =>
                              setPhotosToUpload((prev) => prev.filter((_, prevIndex) => index !== prevIndex))
                            }
                            className="hero-cursor-pointer mb-1 d-block"
                          />
                        </span>
                      );
                    })}
                  </Box>
                </>
              )}

              {actorPhotos.length > 0 && (
                <>
                  <Box component="section" className="mb-3">
                    <Typography variant="h5">Les photos</Typography>
                    <Grid container spacing={1}>
                      {actorPhotos.map((photo, index) => {
                        return (
                          <Grid key={index} item xs={6} sm={4} md={3} lg={2} sx={{ mb: 3, ps: 1, pe: 1 }}>
                            <img src={`${process.env.AWS_FILE_PREFIX}${photo.imageName}`} alt="" />
                            <DeleteForeverIcon
                              onClick={() => deleteOldPhoto(index)}
                              className="hero-cursor-pointer mb-1 d-block"
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};
