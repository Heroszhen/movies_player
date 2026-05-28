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
              <Route path="/admin/utilisateurs" element={<AdminUser />} />
              <Route path="/admin/acteurs" element={<AdminActor />} />
              <Route path="/admin/videos" element={<AdminMovie />} />
              <Route path="/admin/categories" element={<AdminCategory />} />
              <Route path="/admin/configuration" element={<AdminConfig />} />
            </Route>

            <Route path="*" element={<Navigate to="/404" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};
export default RoutesWrapper;
