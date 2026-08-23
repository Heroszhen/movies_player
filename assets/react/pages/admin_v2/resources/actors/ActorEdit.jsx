import { useRef } from 'react';
import { Edit } from 'react-admin';
import { ActorForm } from './ActorForm';

export const ActorEdit = () => {
  const editorRef = useRef(null);

  const transform = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { currentPhoto, description, ...rest } = data;

    return { ...rest, description: editorRef.current?.getValue() ?? data.description };
  };

  return (
    <Edit transform={transform}>
      <ActorForm editorRef={editorRef} />
    </Edit>
  );
};
