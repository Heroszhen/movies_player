import {
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
import { Box, Modal, Typography } from '@mui/material';
import { getModalStyle } from '../../../../services/data';
import { PhotoEdit } from '../common/PhotoEdit';
import { deletePhoto } from '../../../../stores/fileStore';
import { wait } from '../../../../services/utils';

export const ActorList = () => {
  const filters = [
    <TextInput source="name" label="Rechercher par nom" alwaysOn key="name" />,
    <TextInput source="country" label="Rechercher par pays" alwaysOn key="country" />,
  ];
  const [actorToModify, setActorToModify] = useState(null);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [update] = useUpdate();

  const toggleModal = (newFormType = null, actor = null) => {
    setActorToModify(actor);
    setFormType(newFormType);
    if (newFormType === null) setOpen(false);
    else setOpen(true);
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
                <CollectionsIcon className="cursor-pointer me-1" />
              </>
            )}
          />
        </Datagrid>
      </List>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(formType === 1 ? 500 : '90%')}>
          {formType === 1 && (
            <>
              <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 4 }}>
                Editer la photo de l&lsquoacteur {actorToModify?.name}
              </Typography>
              <PhotoEdit modifyPhoto={modifyPhoto} />
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};
