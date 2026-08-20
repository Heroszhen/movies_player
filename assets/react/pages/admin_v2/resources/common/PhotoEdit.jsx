import { ImageInput, ImageField, SimpleForm } from 'react-admin';
import { addFile } from '../../../../stores/fileStore';

export const PhotoEdit = (props) => {
  const handleSubmit = async (data) => {
    if (data.photo) {
      const newFile = await addFile(data.photo.rawFile);
      props.modifyPhoto(newFile);
    }
  };
  return (
    <SimpleForm onSubmit={handleSubmit}>
      <ImageInput
        source="photo"
        label="Photo"
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.avif', '.gif', '.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  );
};
