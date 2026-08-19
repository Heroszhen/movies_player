import { List, Datagrid, TextField, EmailField, DateField, FunctionField } from 'react-admin';
import { PublicToggleBtn } from './PublicToggleBtn';

export const UserList = () => (
  <List pagination={false} disableSyncWithLocation>
    <Datagrid>
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
