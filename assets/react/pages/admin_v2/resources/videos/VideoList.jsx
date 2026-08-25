import {
  BulkDeleteButton,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  NumberField,
  Pagination,
  TextField,
  TextInput,
} from 'react-admin';

export const VideoList = () => {
  const filters = [
    <TextInput source="title" label="Rechercher par titre" alwaysOn key="title" />,
    <TextInput source="actors.name" label="Rechercher par acteur" alwaysOn key="acteur" />,
  ];

  return (
    <>
      <List
        perPage={20}
        filters={filters}
        sort={{ field: 'id', order: 'DESC' }}
        pagination={<Pagination rowsPerPageOptions={[]} />}>
        <Datagrid rowClick={false} bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}>
          <NumberField source="id" />
          <TextField source="title" label="Titre" />
          <FunctionField
            label="Photo"
            render={(record) =>
              record.poster ? (
                <img
                  src={`${process.env.AWS_FILE_PREFIX}${record.poster.imageName}`}
                  alt=""
                  style={{ width: 100, height: 'auto', objectFit: 'cover' }}
                />
              ) : null
            }
          />
          <FunctionField
            source="actors"
            label="Acteurs"
            render={(record) =>
              record.actors.map((actor) => actor.name).map((name, index) => <div key={index}>{name}</div>)
            }
          />
          <FunctionField
            label="Actions"
            render={() => (
              <>
                <EditButton className="me-1" />
              </>
            )}
          />
        </Datagrid>
      </List>
    </>
  );
};
