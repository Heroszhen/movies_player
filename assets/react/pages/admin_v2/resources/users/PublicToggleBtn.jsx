import { useUpdate } from 'react-admin';
import { Switch } from '@mui/material';

export const PublicToggleBtn = ({ record }) => {
  const [update, { isLoading }] = useUpdate();
  const handleChange = (event) => {
    update('users', {
      id: record.id,
      data: { isPublic: event.target.checked },
      previousData: record,
    });
  };
  return <Switch checked={record.isPublic} onChange={handleChange} disabled={isLoading} />;
};
