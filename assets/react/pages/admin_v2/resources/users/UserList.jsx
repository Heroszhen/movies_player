import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  FunctionField,
  BulkDeleteButton,
  useUpdate,
} from 'react-admin';
import { PublicToggleBtn } from './PublicToggleBtn';
import { Box, Button, Modal, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { getModalStyle } from '../../../../services/data';
import { useState } from 'react';
import { PhotoEdit } from '../common/PhotoEdit';
import { deletePhoto } from '../../../../stores/fileStore';
import { TableClassInjector } from '../common/TableClassInjector';

export const UserList = () => {
  const UserBulkActionButtons = () => <BulkDeleteButton mutationMode="pessimistic" />;
  const [open, setOpen] = useState(false);
  const [userToModify, setUserToModify] = useState(null);
  const [update] = useUpdate();

  const modifyPhoto = async (newPhoto) => {
    if (newPhoto['@id']) {
      const oldPhotoId = userToModify?.photo?.id;
      await update('users', {
        id: userToModify.id,
        data: { photo: newPhoto['@id'] },
        previousData: userToModify,
      });
      if (oldPhotoId) await deletePhoto(oldPhotoId);
    }
  };

  return (
    <>
      <List pagination={false}>
        <TableClassInjector />
        <Datagrid rowClick="edit" bulkActionButtons={<UserBulkActionButtons />}>
          <TextField source="id" />
          <EmailField source="email" label="Mail" />
          <FunctionField
            label="Photo"
            render={(record) =>
              record.photo ? (
                <img
                  src={`${process.env.AWS_FILE_PREFIX}${record.photo.imageName}`}
                  alt=""
                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                />
              ) : null
            }
          />
          <FunctionField source="roles" label="Rôles" render={(record) => record.roles.join(', ')} />
          <FunctionField
            source="isPublic"
            label="Public"
            render={(record) => <PublicToggleBtn record={record} />}
            onClick={(e) => e.stopPropagation()}
          />
          <DateField source="createdAt" label="Créé" />
          <FunctionField
            label="Actions"
            render={(record) => (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  className="me-1"
                  onClick={() => {
                    setOpen(true);
                    setUserToModify(record);
                  }}>
                  Photo
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  component={Link}
                  to={`/admin/users/${record.id}/password`}>
                  Mot de passe
                </Button>
              </>
            )}
            onClick={(e) => e.stopPropagation()}
          />
        </Datagrid>
      </List>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle()}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 4 }}>
            Editer une photo de profil
          </Typography>
          <PhotoEdit modifyPhoto={modifyPhoto} />
        </Box>
      </Modal>
    </>
  );
};
