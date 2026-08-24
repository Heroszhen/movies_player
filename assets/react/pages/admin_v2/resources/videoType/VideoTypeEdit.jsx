import { Create, Edit } from 'react-admin';
import { VideoTypeForm } from './VideoTypeForm';

export const VideoTypeCreate = () => {
  return (
    <>
      <Create>
        <VideoTypeForm />
      </Create>
    </>
  );
};

export const VideoTypeEdit = () => {
  const transform = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { createdAt, updatedAt, ...rest } = data;
    return rest;
  };

  return (
    <>
      <Edit mutationMode="pessimistic" transform={transform}>
        <VideoTypeForm />
      </Edit>
    </>
  );
};
