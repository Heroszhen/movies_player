import { Edit } from 'react-admin';
import { CategoryForm } from './CategoryForm';

const transform = (data) => {
  // eslint-disable-next-line no-unused-vars
  const { movies, ...rest } = data;
  return rest;
};

export const CategoryEdit = () => {
  return (
    <Edit mutationMode="pessimistic" transform={transform}>
      <CategoryForm />
    </Edit>
  );
};
