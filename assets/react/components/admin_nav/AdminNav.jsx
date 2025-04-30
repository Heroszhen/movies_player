import './AdminNav.scss';
import { NavLink } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import HomeIcon from '@mui/icons-material/Home';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const AdminNav = (props, ref) => {
  return (
    <nav id="admin-nav" className="position-fixed bottom-0 start-0" ref={ref} {...props}>
      <NavLink to="/videos" className={({ isActive }) => (isActive ? 'active' : '')}>
        <HomeIcon />
        <div>Accueil</div>
      </NavLink>
      <NavLink to="/admin/utilisateurs" className={({ isActive }) => (isActive ? 'active' : '')}>
        <PeopleIcon />
        <div>Utilisateurs</div>
      </NavLink>
      <NavLink to="/admin/photos" className={({ isActive }) => (isActive ? 'active' : '')}>
        <AddPhotoAlternateIcon />
        <div>Photos</div>
      </NavLink>
      <NavLink to="/admin/acteurs" className={({ isActive }) => (isActive ? 'active' : '')}>
        <Diversity3Icon />
        <div>Acteurs</div>
      </NavLink>
      <NavLink to="/admin/videos" className={({ isActive }) => (isActive ? 'active' : '')}>
        <MovieCreationIcon />
        <div>Vidéos</div>
      </NavLink>
      <a className="hero-cursor-pointer" onClick={() => props.toggleAdminNav()}>
        <MenuOpenIcon />
        <div>Fermer</div>
      </a>
    </nav>
  );
};
export default AdminNav;
