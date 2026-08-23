import { Admin, Resource, Layout, CustomRoutes } from 'react-admin';
import dataProvider from './dataProvider';
import { UserList } from './resources/users/UserList';
import { QueryClient } from '@tanstack/react-query';
import { CustomMenu } from './CustomMenu';
import { UserCreate } from './resources/users/UserCreate';
import { UserEdit } from './resources/users/UserEdit';
import { Route } from 'react-router-dom';
import { PasswordEdit } from './resources/users/PasswordEdit';
import { CategoryList } from './resources/categories/CategoryList';
import { CategoryEdit } from './resources/categories/CategoryEdit';
import { CategoryCreate } from './resources/categories/CategoryCreate';
import { ActorList } from './resources/actors/ActorList';
import { ActorCreate } from './resources/actors/ActorCreate';
import { ActorEdit } from './resources/actors/ActorEdit';

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
    <CustomRoutes>
      <Route path="/users/:id/password" element={<PasswordEdit />} />
    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} />
    <Resource name="actors" list={ActorList} create={ActorCreate} edit={ActorEdit} />
  </Admin>
);

export default AdminApp;
