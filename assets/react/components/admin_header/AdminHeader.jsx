import { useState } from 'react';
import './AdminHeader.scss';
import DehazeIcon from '@mui/icons-material/Dehaze';
import useUserStore from '../../stores/userStore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { logout } from '../../services/utils';

const AdminHeader = (props) => {
  const { user } = useUserStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header
      id="admin-header"
      className="w-100 hero-height-50 position-fixed top-0 start-0 d-flex justify-content-between align-items-center ps-5 pe-4 hero-zindex-50 bg-white">
      <DehazeIcon
        className="hero-cursor-pointer"
        onClick={() => {
          props.mainRef.current.classList.toggle('admin-nav-close'),
            props.adminNavRef.current.classList.toggle('d-none');
        }}
      />
      {user !== null && (
        <Box component="div">
          <Box
            component="div"
            id="user-dropdown"
            aria-controls={open ? 'user-dropdown-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            {user.photo && (
              <Box
                component="div"
                sx={{ width: 35, height: 35, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}>
                <img src={`${process.env.AWS_FILE_PREFIX}${user.photo.imageName}`} alt="" />
              </Box>
            )}
            {!user.photo && <Box component="div">{user.email}</Box>}
          </Box>
          <Menu
            id="user-dropdown-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'user-dropdown' }}>
            <MenuItem onClick={handleClose}>Bonjour {user.email}</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      )}
    </header>
  );
};
export default AdminHeader;
