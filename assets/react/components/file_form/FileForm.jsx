import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addFile } from '../../stores/fileStore';
import { Box, Button, Typography, Input } from '@mui/material';
import { isImageFile, readFile } from '../../services/utils';

const FileForm = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const [fileLink, setFileLink] = useState(undefined);

  useEffect(() => {
    reset({
      imageFile: undefined,
    });
  }, []);

  const onSubmit = async (data) => {
    const photo = await addFile(data.imageFile);
    if (props.setFile && photo['@id']) await props.setFile(photo);
  };

  return (
    <section id="wrap-form-file">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box component="div" sx={{ mb: 2 }}>
          <Controller
            control={control}
            name={'imageFile'}
            rules={{
              required: 'The picture is required',
              validate: (value) => {
                if (value) {
                  if (!isImageFile(value)) return 'This is not an image';
                }
              },
            }}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Input
                  {...field}
                  onChange={async (event) => {
                    const file = event.target.files[0];
                    onChange(file);
                    const link = await readFile(file);
                    setFileLink(link);
                  }}
                  type="file"
                  id="imageFile"
                  inputProps={{ accept: 'image/*' }}
                  fullWidth="true"
                  data-value={value ? value.name : ''}
                />
              );
            }}
          />
          {errors.imageFile && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors.imageFile.message}
            </Typography>
          )}
        </Box>
        <Button variant="contained" type="submit">
          Envoyer
        </Button>
        {fileLink && (
          <Box component="div" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
            <img src={fileLink} alt="" />
          </Box>
        )}
      </form>
    </section>
  );
};
export default FileForm;
