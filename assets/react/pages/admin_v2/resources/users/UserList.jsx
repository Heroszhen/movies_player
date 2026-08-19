import { List, Datagrid, TextField, EmailField, DateField, FunctionField, BulkDeleteButton } from 'react-admin';
import { PublicToggleBtn } from './PublicToggleBtn';

const UserBulkActionButtons = () => <BulkDeleteButton mutationMode="pessimistic" />;

export const UserList = () => (
  <List pagination={false}>
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
      <FunctionField source="isPublic" label="Public" render={(record) => <PublicToggleBtn record={record} />} />
      <DateField source="createdAt" label="Créé" />
    </Datagrid>
  </List>
);
