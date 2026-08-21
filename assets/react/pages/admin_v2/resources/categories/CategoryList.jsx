import { CreateButton, List, Pagination, SimpleList, SortButton, TextInput, TopToolbar } from 'react-admin';

export const CategoryList = () => {
  const ListActions = () => (
    <TopToolbar>
      <SortButton fields={['id', 'name']} />
      <CreateButton />
    </TopToolbar>
  );

  const categoryFilters = [<TextInput source="name" label="Rechercher par nom" alwaysOn key="name" />];

  const CategoryPagination = () => <Pagination rowsPerPageOptions={[]} />;

  return (
    <>
      <List perPage={20} actions={<ListActions />} filters={categoryFilters} pagination={<CategoryPagination />}>
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => `#${record.id}`}
          tertiaryText={(record) => `${record.movies?.length} vidéos`}
          sx={{
            '& .MuiListItem-root': {
              borderBottom: '1px solid black',
            },
          }}
        />
      </List>
    </>
  );
};
