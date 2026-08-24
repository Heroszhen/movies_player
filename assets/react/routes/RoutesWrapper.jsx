import { Routes, Route, Navigate } from 'react-router-dom';
import LoginGuard from './LoginGuard.jsx';
import AdminGuard from './AdminGuard.jsx';

import Home from '../pages/home/Home.jsx';
import Contact from '../pages/contact/Contact.jsx';
import Movies from '../pages/movies/Movies.jsx';
import Movie from '../pages/movie/movie.jsx';
import Actors from '../pages/actors/Actors.jsx';
import Actor from '../pages/actor/Actor.jsx';
import Category from '../pages/category/category.jsx';

import AdminUser from '../pages/admin/user/User.jsx';
import AdminActor from '../pages/admin/actor/AdminActor.jsx';
import AdminMovie from '../pages/admin/movie/AdminMovie.jsx';
import { AdminCategory } from '../pages/admin/category/AdminCategory.jsx';
import AdminConfig from '../pages/admin/config/AdminConfig.jsx';
import NotFound from '../pages/notfound/NotFound.jsx';

import AdminApp from '../pages/admin_v2/AdminApp.jsx';

const RoutesWrapper = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        {props.canQuery && (
          <>
            <Route element={<LoginGuard />}>
              <Route path="/contact" element={<Contact />} />
              <Route path="/videos" element={<Movies />} />
              <Route path="/video/:id" element={<Movie />} />
              <Route path="/acteurs" element={<Actors />} />
              <Route path="/acteur/:id" element={<Actor />} />
              <Route path="/categorie/:id" element={<Category />} />
              <Route path="/categories" element={<Category />} />
            </Route>

            <Route element={<AdminGuard />}>
              <Route path="/admin_v1/utilisateurs" element={<AdminUser />} />
              <Route path="/admin_v1/acteurs" element={<AdminActor />} />
              <Route path="/admin_v1/videos" element={<AdminMovie />} />
              <Route path="/admin_v1/categories" element={<AdminCategory />} />
              <Route path="/admin_v1/configuration" element={<AdminConfig />} />
              <Route path="/admin/*" element={<AdminApp />} />
            </Route>

            <Route path="*" element={<Navigate to="/404" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};
export default RoutesWrapper;
