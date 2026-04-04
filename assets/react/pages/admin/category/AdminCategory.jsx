import { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import {
  Box,
  Button,
  TextField,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from '@mui/material';
import usePaginatorStore, { setRoute, setPage, setKeywords, getPaginator } from '../../../stores/paginatorStore';
import { useForm } from 'react-hook-form';
import { getModalStyle } from '../../../services/data';
import useCategoryStore from '../../../stores/categoryStore';
import { useLocation } from 'react-router-dom';

export const AdminCategory = () => {
  const { categories, getCategories, editCategory } = useCategoryStore();
  const [formType, setFormType] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [orderBy, setOrderBy] = useState('order[id]=asc');
  const reactLocation = useLocation();
  const [categoryIndex, setCategoryIndex] = useState(null);
  const bc = new BroadcastChannel('admin_movie');

  useEffect(() => {
    getPaginator(reactLocation.pathname);
    setRoute(reactLocation.pathname);

    return () => {
      bc.close();
    };
  }, []);

  const { page, itemsPerPage, total, keywords, route } = usePaginatorStore();

  useEffect(() => {
    if (route === reactLocation.pathname) {
      getCategories(page, keywords, orderBy);
    }
  }, [page, keywords, route, orderBy]);

  const handleChangePage = async (event, newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const toggleForm = async (type = null, index = null) => {
    setFormType(type);
    if (type === null) {
      handleClose();
    } else {
      if (type === 1) {
        reset({
          name: index === null ? null : categories[index].name,
        });
      }
      if (index !== null) return;
      handleOpen();
    }
  };

  const searchByKeywords = (e) => {
    if (e.type === 'keyup' && e.keyCode === 13) {
      setKeywords(e.target.value);
    } else if (e.type === 'change' && e.target.value === '') {
      setKeywords(e.target.value);
    }
    setPage(1);
  };

  const onSubmit = async (data) => {
    if (formType === 1) {
      await editCategory(data, categoryIndex === null ? null : categories[categoryIndex].id);
    }

    handleClose();
    bc.postMessage({ data: 'category' });
  };

  const getFormField = () => {
    return (
      <TextField
        label="Nom *"
        type="text"
        fullWidth={true}
        sx={{ mb: 2 }}
        size="small"
        {...register('name', { required: 'Le champs est obligatoire' })}
        error={!!errors.name}
        helperText={errors.name?.message}
        onKeyUp={validateFormByKeydown}
      />
    );
  };

  const validateFormByKeydown = async (e) => {
    const value = e.target.value;
    if (e.key === 'Enter' && value !== '') {
      await onSubmit({ name: value });
      setCategoryIndex(null);
    }
  };

  return (
    <>
      <section id="admin-category" className="video" onClick={() => setCategoryIndex(null)}>
        <div className="container-fluid pt-3">
          <div className="row">
            <div className="col-12 mb-3">
              <h3 className="d-flex align-items-center">
                Catégories
                <AddCircleIcon className="hero-cursor-pointer ms-2" onClick={() => toggleForm(1)} />
              </h3>
            </div>
            <div className="col-12 mb-3">
              <Box component="div" sx={{ mb: 2 }}>
                <TextField
                  type="search"
                  fullWidth={true}
                  placeholder="Rechercher..."
                  size="small"
                  onChange={(e) => searchByKeywords(e)}
                  onKeyUp={(e) => searchByKeywords(e)}
                  defaultValue={keywords}
                />
              </Box>
              <TableContainer component={Paper}>
                <Table className="striped">
                  <TableHead sx={{ fontWeight: 'bold' }}>
                    <TableRow>
                      <TableCell>
                        <div className="flex">
                          Id
                          <div>
                            <NorthIcon className="hero-cursor-pointer" onClick={() => setOrderBy('order[id]=asc')} />
                            <SouthIcon className="hero-cursor-pointer" onClick={() => setOrderBy('order[id]=desc')} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          Nom
                          <div>
                            <NorthIcon className="hero-cursor-pointer" onClick={() => setOrderBy('order[name]=asc')} />
                            <SouthIcon className="hero-cursor-pointer" onClick={() => setOrderBy('order[name]=desc')} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Vidéos</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category, index) => {
                      return (
                        <TableRow key={index} hover={true}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {categoryIndex !== index && (
                              <div
                                onDoubleClick={() => {
                                  setCategoryIndex(index);
                                  toggleForm(1, index);
                                }}>
                                {category.name}
                              </div>
                            )}
                            {categoryIndex === index && <div>{getFormField()}</div>}
                          </TableCell>
                          <TableCell>
                            <div>{category.movies.length}</div>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="col-12">
              <Pagination
                count={Math.ceil(total / itemsPerPage)}
                page={page}
                color="secondary"
                onChange={handleChangePage}
              />
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={getModalStyle(500)}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 4 }}>
            {formType === 1 && 'Editer une catégorie'}
          </Typography>
          {[1].includes(formType) && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {formType === 1 && getFormField()}
              <Button variant="contained" type="submit">
                Envoyer
              </Button>
            </form>
          )}
        </Box>
      </Modal>
    </>
  );
};
