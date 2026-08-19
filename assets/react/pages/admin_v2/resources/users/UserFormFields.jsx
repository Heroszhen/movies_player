import { TextInput, SelectArrayInput, BooleanInput, required, email, maxLength } from 'react-admin';
import { Box } from '@mui/material';

export const UserFormFields = ({ isCreate }) => {
  const ROLE_CHOICES = [
    { id: 'ROLE_USER', name: 'User' },
    { id: 'ROLE_ADMIN', name: 'Admin' },
  ];

  return (
    <>
      <Box display="flex" gap={2} width="100%">
        <TextInput source="email" type="email" label="Mail" validate={[required(), email(), maxLength(30)]} />
        <SelectArrayInput
          source="roles"
          choices={ROLE_CHOICES}
          defaultValue={isCreate ? ['ROLE_USER'] : undefined}
          label="Rôles"
          validate={[required()]}
        />
      </Box>
      <BooleanInput source="isPublic" label="Public" defaultValue={isCreate ? false : undefined} />
    </>
  );
};
