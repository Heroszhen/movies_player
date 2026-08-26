import { useEffect } from 'react';
import { useListContext } from 'react-admin';

export const TableClassInjector = () => {
  const { isLoading } = useListContext();

  useEffect(() => {
    if (!isLoading) {
      document.querySelector('.RaDatagrid-tableWrapper table')?.classList.add('responsive');
    }
  }, [isLoading]);

  return null;
};
