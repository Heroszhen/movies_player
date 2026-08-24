import './AdminNav.scss';
import { NavLink } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import HomeIcon from '@mui/icons-material/Home';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { forwardRef } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const AdminNav = forwardRef(({ toggleAdminNav }, ref) => {
  return (
    <nav id="admin-nav" className="position-fixed bottom-0 start-0" ref={ref}>
      <NavLink to="/videos" className={({ isActive }) => (isActive ? 'active' : '')}>
        <HomeIcon />
        <div>Accueil</div>
      </NavLink>
      <NavLink to="/admin_v1/utilisateurs" className={({ isActive }) => (isActive ? 'active' : '')}>
        <PeopleIcon />
        <div>Utilisateurs</div>
      </NavLink>
      <NavLink to="/admin_v1/photos" className={({ isActive }) => (isActive ? 'active' : '')}>
        <AddPhotoAlternateIcon />
        <div>Photos</div>
      </NavLink>
      <NavLink to="/admin_v1/acteurs" className={({ isActive }) => (isActive ? 'active' : '')}>
        <Diversity3Icon />
        <div>Acteurs</div>
      </NavLink>
      <NavLink to="/admin_v1/videos" className={({ isActive }) => (isActive ? 'active' : '')}>
        <MovieCreationIcon />
        <div>Vidéos</div>
      </NavLink>
      <NavLink to="/admin_v1/categories" className={({ isActive }) => (isActive ? 'active' : '')}>
        <CategoryIcon />
        <div>Catégories</div>
      </NavLink>
      <NavLink to="/admin_v1/configuration" className={({ isActive }) => (isActive ? 'active' : '')}>
        <MiscellaneousServicesIcon />
        <div>Configuration</div>
      </NavLink>
      <a className="hero-cursor-pointer" onClick={() => toggleAdminNav()}>
        <MenuOpenIcon />
        <div>Fermer</div>
      </a>
    </nav>
  );
});
AdminNav.displayName = 'AdminNav';
export default AdminNav;
