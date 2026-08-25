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
import { VideoCreate, VideoEdit } from './resources/videos/VideoEdit';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';

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
    <Resource
      name="users"
      list={UserList}
      create={UserCreate}
      edit={UserEdit}
      options={{ label: 'Utilisateurs' }}
      icon={PeopleIcon}
    />
    <CustomRoutes>
      <Route path="/users/:id/password" element={<PasswordEdit />} />
    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} icon={CategoryIcon} />
    <Resource name="actors" list={ActorList} create={ActorCreate} edit={ActorEdit} icon={Diversity3Icon} />
    <Resource
      name="video_types"
      list={VideoTypeList}
      create={VideoTypeCreate}
      edit={VideoTypeEdit}
      icon={FilterNoneIcon}
    />
    <Resource name="movies" list={VideoList} create={VideoCreate} edit={VideoEdit} icon={MovieCreationIcon} />
  </Admin>
);

export default AdminApp;
