import { useState, useEffect, useRef } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useActorStore from '../../../stores/actorStore';
import usePaginatorStore, { setRoute, setPage, setKeywords, getPaginator } from '../../../stores/paginatorStore';
import { deletePhoto, addFile, getPhotoByActorId } from '../../../stores/fileStore';
import { useLocation } from 'react-router-dom';
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
  Grid,
  Input,
  LinearProgress,
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PhotoIcon from '@mui/icons-material/Photo';
import { getModalStyle } from '../../../services/data';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import FileForm from '../../../components/file_form/FileForm';
import Editor from '../../../components/editor/Editor';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const AdminActor = () => {
  const { actors, getActors, editActor } = useActorStore();
  const reactLocation = useLocation();
  const [formType, setFormType] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [actorIndex, setActorIndex] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();
  const bc = new BroadcastChannel('admin_movie');
  const editorRef = useRef(null);
  const [orderBy, setOrderBy] = useState('order[id]=asc');
  const [photosToUpload, setPhotosToUpload] = useState([]);
  const [actorPhotos, setActorPhotos] = useState([]);
  const [progress, setProgress] = useState(0);

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
      getActors(page, keywords, orderBy);
    }
  }, [page, keywords, route, orderBy]);

  const handleChangePage = async (event, newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const toggleForm = async (type = null, index = null) => {
    if (type === null) {
      handleClose();
    } else {
      if (type === 1) {
        reset({
          name: index === null ? null : actors[index].name,
          country: index === null ? null : actors[index].country,
          birthday: index === null || !actors[index].birthday ? null : actors[index].birthday.split('T')[0],
          description: index === null ? null : actors[index].description,
        });
      }

      if (type === 3) {
        setActorPhotos([]);
        setProgress(0);
        setPhotosToUpload([]);
        setActorPhotos(await getPhotoByActorId(actors[index].id));
      }
      handleOpen();
    }
    setFormType(type);
    setActorIndex(index);
  };

  const onSubmit = async (data) => {
    if (formType === 1) {
      data.description = editorRef.current.getValue();
      await editActor(data, actorIndex === null ? null : actors[actorIndex].id);
    }
    if (formType === 2) {
      if (data['@id']) {
        const oldPhotoId = actors[actorIndex].currentPhoto?.id ?? null;
        await editActor({ currentPhoto: data['@id'] }, actors[actorIndex].id);
        if (oldPhotoId) await deletePhoto(oldPhotoId);
      }
    }
    handleClose();
    bc.postMessage({ data: 'actor' });
  };

  const searchByKeywords = (e) => {
    if (e.type === 'keyup' && e.keyCode === 13) {
      setKeywords(e.target.value);
    } else if (e.type === 'change' && e.target.value === '') {
      setKeywords(e.target.value);
    }
    setPage(1);
  };

  const handleActorPhotos = (e) => {
    const files = e.target.files;
    const newFiles = [];
    for (let i = files.length - 1; i >= 0; i--) {
      newFiles.unshift(files.item(i));
    }
    setPhotosToUpload((prev) => [...newFiles, ...prev]);
    setProgress(0);
  };

  const sendNewPhotos = async () => {
    const options = { actorId: actors[actorIndex].id };
    for (let i = 0; i < photosToUpload.length; i++) {
      setProgress(Math.round(((i + 1) / photosToUpload.length) * 100));
      const photo = await addFile(photosToUpload[i], options);
      setActorPhotos((prev) => [...prev, photo]);
    }

    setPhotosToUpload([]);
  };

  const deleteOldPhoto = async (index) => {
    await deletePhoto(actorPhotos[index].id);
    setActorPhotos((prev) => prev.filter((_, prevIndex) => prevIndex !== index));
  };

  return (
    <>
      <section id="admin-actor" className="video">
        <div className="container-fluid pt-3">
          <div className="row">
            <div className="col-12 mb-3">
              <h3 className="d-flex align-items-center">
                Acteurs
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
                <Table className="striped responsive">
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
                      <TableCell>Naissance</TableCell>
                      <TableCell>Pays</TableCell>
                      <TableCell>Photo</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actors.map((actor, index) => {
                      return (
                        <TableRow key={index} hover={true}>
                          <TableCell>{actor.id}</TableCell>
                          <TableCell>{actor.name}</TableCell>
                          <TableCell>{actor.birthday && moment(actor.birthday).format('DD/MM/YYYY')}</TableCell>
                          <TableCell>{actor.country}</TableCell>
                          <TableCell>
                            {actor.currentPhoto && (
                              <img
                                src={`${process.env.AWS_FILE_PREFIX}${actor.currentPhoto.imageName}`}
                                alt=""
                                className="hero-width-120"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <PhotoIcon className="me-3 mb-3 hero-cursor-pointer" onClick={() => toggleForm(2, index)} />
                            <ModeEditIcon
                              className="hero-cursor-pointer mb-3 me-3"
                              onClick={() => toggleForm(1, index)}
                            />
                            <CollectionsIcon
                              className="hero-cursor-pointer mb-3"
                              onClick={() => toggleForm(3, index)}
                            />
                          </TableCell>
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
        <Box sx={getModalStyle(formType === 1 ? 800 : formType === 2 ? 500 : '90%')}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 4 }}>
            {formType === 1 && 'Editer un acteur'}
            {formType === 2 && 'Editer une photo de profil'}
            {formType === 3 && 'Ajouter des photos'}
          </Typography>
          {[1].includes(formType) && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {formType === 1 && (
                <>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Nom *"
                        type="text"
                        fullWidth={true}
                        sx={{ mb: 2 }}
                        size="small"
                        {...register('name', { required: 'Le champs est obligatoire' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Pays"
                        type="text"
                        fullWidth={true}
                        sx={{ mb: 2 }}
                        size="small"
                        {...register('country')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Date de naissance"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth={true}
                        sx={{ mb: 2 }}
                        size="small"
                        {...register('birthday')}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mb: 2 }}>
                    <Editor ref={editorRef} label="Description" value={getValues('description')} />
                  </Box>
                </>
              )}
              <Button variant="contained" type="submit">
                Envoyer
              </Button>
            </form>
          )}
          {formType === 2 && <FileForm setFile={onSubmit} />}
          {formType === 3 && (
            <section>
              <Input
                onChange={(e) => handleActorPhotos(e)}
                type="file"
                id="upload-photos"
                inputProps={{ accept: 'image/*', multiple: true }}
                fullWidth="true"
                className="mb-2"
              />
              <Button
                variant="contained"
                type="button"
                disabled={photosToUpload.length === 0}
                sx={{ mb: 2 }}
                onClick={() => sendNewPhotos()}>
                Envoyer
              </Button>

              {photosToUpload.length > 0 && (
                <>
                  <Typography variant="h5">Les nouvelles photos</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {progress}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', mb: 3 }}>
                      <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                  </Box>
                  <Box component="section" className="mb-5 d-flex" sx={{ overflowY: 'auto' }}>
                    {photosToUpload.map((file, index) => {
                      return (
                        <span className="pe-3" key={index}>
                          <img src={URL.createObjectURL(file)} alt="" style={{ width: 400 + 'px' }} />
                          <DeleteForeverIcon
                            onClick={() =>
                              setPhotosToUpload((prev) => prev.filter((_, prevIndex) => index !== prevIndex))
                            }
                            className="hero-cursor-pointer mb-1 d-block"
                          />
                        </span>
                      );
                    })}
                  </Box>
                </>
              )}

              {actorPhotos.length > 0 && (
                <>
                  <Box component="section" className="mb-3">
                    <Typography variant="h5">Les photos</Typography>
                    <Grid container spacing={1}>
                      {actorPhotos.map((photo, index) => {
                        return (
                          <Grid key={index} item xs={6} sm={4} md={3} lg={2} sx={{ mb: 3, ps: 1, pe: 1 }}>
                            <img src={`${process.env.AWS_FILE_PREFIX}${photo.imageName}`} alt="" />
                            <DeleteForeverIcon
                              onClick={() => deleteOldPhoto(index)}
                              className="hero-cursor-pointer mb-1 d-block"
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </>
              )}
            </section>
          )}
        </Box>
      </Modal>
    </>
  );
};
export default AdminActor;
