import { useParams } from 'react-router-dom';
import { minLength, PasswordInput, regex, required, SimpleForm } from 'react-admin';
import { Box, Typography } from '@mui/material';
import useUserStore from '../../../../stores/userStore';
import { CustomToolbar } from '../common/CustomToolbar';

export const PasswordEdit = () => {
  const { id } = useParams();
  const updatePassword = useUserStore((state) => state.updatePassword);

  const handleSubmit = async (data) => {
    await updatePassword(data, id);
  };

  return (
    <>
      {id !== null && (
        <Box component={'div'} width="100%">
          <Typography variant="h4" className="mt-3">
            Changer le mot de passe (utilisateur #{id})
          </Typography>
          <SimpleForm toolbar={<CustomToolbar />} onSubmit={handleSubmit}>
            <PasswordInput
              source="plainPassword"
              label="Nouveau mot de passe"
              validate={[
                required(),
                minLength(8),
                regex(
                  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/,
                  '8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial'
                ),
              ]}
              fullWidth
            />
          </SimpleForm>
        </Box>
      )}
    </>
  );
};
