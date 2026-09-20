import { Typography } from '@mui/material';
import { useUpdate } from 'react-admin';
import { wait } from '../../../../services/utils';
import { deletePhoto } from '../../../../stores/fileStore';
import { PhotoEdit } from '../common/PhotoEdit';

export const VideoPhotoEdit = ({ video }) => {
  const [update] = useUpdate();

  const modifyPhoto = async (newPhoto) => {
    if (newPhoto['@id']) {
      const oldPhotoId = video?.poster?.id;
      await update('movies', {
        id: video.id,
        data: { poster: newPhoto['@id'] },
        previousData: video,
      });

      await wait(0.5);
      if (oldPhotoId) await deletePhoto(oldPhotoId);
    }
  };

  return (
    <>
      <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 4 }}>
        Editer la photo de {video?.name}
      </Typography>
      <PhotoEdit modifyPhoto={modifyPhoto} />
    </>
  );
};
