import { Datagrid, EditButton, FunctionField, List, NumberField, Pagination, TextField, TextInput } from 'react-admin';
import PhotoIcon from '@mui/icons-material/Photo';

export const ActorList = () => {
  const filters = [
    <TextInput source="name" label="Rechercher par nom" alwaysOn key="name" />,
    <TextInput source="country" label="Rechercher par pays" alwaysOn key="country" />,
  ];

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
            render={() => (
              <>
                <EditButton className="me-1" />
                <PhotoIcon className="cursor-pointer" />
              </>
            )}
          />
        </Datagrid>
      </List>
    </>
  );
};
