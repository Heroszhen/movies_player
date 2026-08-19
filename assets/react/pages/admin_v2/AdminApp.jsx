import { Admin, Resource, Layout } from 'react-admin';
import dataProvider from './dataProvider';
import { UserList } from './resources/users/UserList';
import { QueryClient } from '@tanstack/react-query';
import { CustomMenu } from './CustomMenu';
import { UserCreate } from './resources/users/UserCreate';
import { UserEdit } from './resources/users/UserEdit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const CustomLayout = (props) => <Layout {...props} menu={CustomMenu} />;

const AdminApp = () => (
  <Admin basename="/admin_v2" dataProvider={dataProvider} queryClient={queryClient} layout={CustomLayout}>
    <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} options={{ label: 'Utilisateurs' }} />
  </Admin>
);

export default AdminApp;
