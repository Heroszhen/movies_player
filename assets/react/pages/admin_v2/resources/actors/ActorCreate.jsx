import { useRef } from 'react';
import { Create } from 'react-admin';
import { ActorForm } from './ActorForm';

export const ActorCreate = () => {
  const editorRef = useRef(null);

  const transform = (data) => ({
    ...data,
    description: editorRef.current?.getValue() ?? data.description,
  });

  return (
    <Create transform={transform}>
      <ActorForm isCreate editorRef={editorRef} />
    </Create>
  );
};
