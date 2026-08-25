import { useRef } from 'react';
import { Create, Edit } from 'react-admin';
import { VideoForm } from './VideoForm';

export const VideoCreate = () => {
  const editorRef = useRef(null);

  const transform = (data) => ({
    ...data,
    type: data.type ? `/api/video_types/${data.type}` : null,
    actors: (data.actors ?? []).map((id) => `/api/actors/${id}`),
    categories: (data.categories ?? []).map((id) => `/api/categories/${id}`),
    description: editorRef.current?.getValue() ?? data.description,
  });

  return (
    <Create transform={transform}>
      <VideoForm isCreate editorRef={editorRef} />
    </Create>
  );
};

export const VideoEdit = () => {
  const editorRef = useRef(null);
  const transform = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { updatedAt, poster, description, ...rest } = data;
    return {
      ...rest,
      type: data.type ? `/api/video_types/${data.type}` : null,
      actors: (data.actors ?? []).map((id) => `/api/actors/${id}`),
      categories: (data.categories ?? []).map((id) => `/api/categories/${id}`),
      description: editorRef.current?.getValue() ?? description,
    };
  };

  return (
    <Edit mutationMode="pessimistic" transform={transform}>
      <VideoForm editorRef={editorRef} />
    </Edit>
  );
};
