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
import { VideoTypeList } from './resources/videoType/VideoTypeList';
import { VideoTypeCreate, VideoTypeEdit } from './resources/videoType/VideoTypeEdit';
import { VideoList } from './resources/videos/VideoList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const CustomLayout = (props) => <Layout {...props} menu={CustomMenu} />;

const AdminApp = () => (
  <Admin basename="/admin" dataProvider={dataProvider} queryClient={queryClient} layout={CustomLayout}>
    <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} options={{ label: 'Utilisateurs' }} />
    <CustomRoutes>
      <Route path="/users/:id/password" element={<PasswordEdit />} />
    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} />
    <Resource name="actors" list={ActorList} create={ActorCreate} edit={ActorEdit} />
    <Resource name="video_types" list={VideoTypeList} create={VideoTypeCreate} edit={VideoTypeEdit} />
    <Resource name="movies" list={VideoList} create={VideoTypeCreate} edit={VideoTypeEdit} />
  </Admin>
);

export default AdminApp;
