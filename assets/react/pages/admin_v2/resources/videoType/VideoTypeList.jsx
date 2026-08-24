import { List, SimpleList } from 'react-admin';

export const VideoTypeList = () => {
  return (
    <List pagination={false}>
      <SimpleList
        primaryText={(record) => record.name}
        secondaryText={(record) => `#${record.id}`}
        sx={{
          '& .MuiListItem-root': {
            borderBottom: '1px solid black',
          },
        }}
      />
    </List>
  );
};
