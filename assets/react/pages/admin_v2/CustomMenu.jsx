import { Menu } from 'react-admin';
import AddHomeIcon from '@mui/icons-material/AddHome';

export const CustomMenu = () => {
  return (
    <>
      {/* <Link to="/">
        <div className="flex items-center pt-[6px] pb-[6px] pl-[16px] pr-[16px] mt-2 text-[rgba(0,0,0,0.87)] hover:bg-[rgba(0,0,0,0.04)]">
          <AddHomeIcon style={{ color: 'rgba(0,0,0,0.54)' }} />
          <div className="ms-3">Accueil</div>
        </div>
      </Link>
      <Menu.ResourceItems /> */}
      <Menu>
        <Menu.Item to="/" primaryText="Accueil" leftIcon={<AddHomeIcon />} />
        <Menu.ResourceItems />
      </Menu>
    </>
  );
};
