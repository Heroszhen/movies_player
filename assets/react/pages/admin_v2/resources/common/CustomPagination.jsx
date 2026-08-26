import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Pagination, useListContext } from 'react-admin';

export const CustomPagination = (props) => {
  const { page, setPage } = useListContext();
  const [newPage, setNewPage] = useState(page);
  const changePage = (event) => {
    if (event.code === 'Enter' && !isNaN(newPage)) setPage(newPage);
  };

  useEffect(() => {
    setNewPage(page);
  }, [page]);

  return (
    <>
      <Pagination {...props} />
      <Box className="text-right">
        <TextField
          sx={{ width: '90px' }}
          type="number"
          size="small"
          placeholder="Page"
          className="mb-5"
          value={newPage}
          onChange={(e) => setNewPage(parseInt(e.target.value))}
          onKeyUp={(e) => changePage(e)}
        />
      </Box>
    </>
  );
};
