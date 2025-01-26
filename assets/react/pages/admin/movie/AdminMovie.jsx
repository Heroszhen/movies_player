import {useState, useEffect} from 'react';
import useMovieStore, {getVideoTypes} from '../../../stores/movieStore';
import usePaginatorStore, { getPaginator, setRoute, setPage, setKeywords } from '../../../stores/paginatorStore'; 
import { useLocation } from "react-router-dom";
import useUserStore from '../../../stores/userStore';
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
  Input,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Autocomplete,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getActorsName } from '../../../stores/actorStore';
import moment from "moment";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PhotoIcon from '@mui/icons-material/Photo';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CategoryIcon from '@mui/icons-material/Category';
import { getModalStyle } from '../../../services/data';
import { Controller, useForm } from 'react-hook-form';
import { addFile } from '../../../stores/fileStore';
import { isImageFile } from '../../../services/utils';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CachedIcon from '@mui/icons-material/Cached';

const AdminMovie = (props) => {
  const reactLocation = useLocation();
  const {user} = useUserStore();
  const [actors, setActors] = useState([]);
  const [formType, setFormType] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false), toggleForm()};
  const [sectionTypes, setSectionTypes] = useState(false);
  const [movieIndex, setMovieIndex] = useState(null);
  const [typeIndex, setTypeIndex] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, control, getValues, setValue } = useForm();
  const [openAlert, setOpenAlert] = useState(false);
  const handleClickOpenAlert = () => {setOpenAlert(true);};
  const handleCloseAlert = () => {setOpenAlert(false);setMovieIndex(null);};
  const [alertTitle, setAlertTitle] = useState(null);
  const [alertContent, setAlertContent] = useState(null);
  const bc = new BroadcastChannel("admin_movie");

  useEffect(() => {
    setRoute(reactLocation.pathname);
    emptyMovies(),
    (async()=>{
      getVideoTypes();
      getListActors();
      
    })();
    
    bc.onmessage = (event) => {
      if (event.data && event.data.data === 'actor') {
        getListActors();
      }
    };

    return () => {
      bc.close();
    }
  }, []);
  const { movies, emptyMovies, getMovies, videoTypes, editVideoType, editMovie, deleteMovie } = useMovieStore();
  const { page, itemsPerPage, total, keywords } = usePaginatorStore();

  useEffect(() => {
    if (user !== null) {
      getMovies(page, keywords);
    }
  }, [user, page]);

  const getListActors = async () => {
    const results = await getActorsName();
    setActors(results);
  }

  const searchByKeywords = (e) => {
    const oldKeywords = keywords;
    if (e.type === 'keyup' && e.keyCode === 13) {
        setKeywords(e.target.value);
        if (oldKeywords !== keywords && page === 1)getMovies(page, keywords);
        else setPage(1);
    }
  }

  const handleChangePage = async (event, newPage) => {
    if(newPage !== page) {
        setPage(newPage);
    }
  };

  const toggleForm = (type = null, index = null) => {
    if (type !== null) {
      if (type === 1) {
        reset({
          name: index === null ? null : videoTypes[index].name
        });
      }
      if (type === 2) {
        reset({
          title: index === null ? '' : movies[index].title,
          releasedAt: index === null || movies[index].releasedAt === null ? null : movies[index].releasedAt.split('T')[0],
          duration: index === null ? 1 : movies[index].duration,
          link: index === null ? '' : movies[index].link,
          type: index === null ? 1 : movies[index].type.id,
          actors: index === null ? [] : movies[index].actors.map(actor=>actor.id)
        });
      }
      if (type === 3) {
        reset({
          imageFile: null
        });
      }
      handleOpen();
    }    
    setFormType(type);
    setTypeIndex(type === 1 ? index : null);
    setMovieIndex([2, 3].includes(type) ? index : null);
  }

  const onSubmit = async (data) => {
    if (formType === 1) {
      editVideoType(data, typeIndex === null ? null : videoTypes[typeIndex].id);
    }
    if (formType === 2) {
      const newActors = data.actors.map((id)=>`/api/actors/${id}`);
      const newTypes = `/api/video_types/${data.type}`;
      data = {...data, actors:newActors, type:newTypes, duration: parseInt(data.duration)};
      editMovie(data, movieIndex === null ? null : movies[movieIndex].id);
    }
    if (formType === 3) {
      const photo = await addFile(data.imageFile);
      if (photo['@id'])editMovie({poster: photo['@id']}, movies[movieIndex].id);
    }
  }

  const alertDeleteMovie = (index) => {
    setMovieIndex(index);
    setAlertTitle(`Suppression`);
    setAlertContent(`Voulez-vous supprimer la vidéo ${movies[index].id} : ${movies[index].title}`);
    handleClickOpenAlert(true);
  }

  const reloadAll = async () => {
    getVideoTypes();
    getMovies(page, keywords);
    getListActors();
  }

  return (
      <>
        <section id="admin-movie" className="vidoe">
          <div className="container-fluid pt-3">
            <div className="row">
              <div className="col-12 mb-3">
                <h3 className="d-flex align-items-center">
                    Vidéos
                    <AddCircleIcon className="hero-cursor-pointer ms-3" onClick={()=>toggleForm(2)} />
                    <CategoryIcon className="hero-cursor-pointer ms-3" onClick={()=>{if(sectionTypes){setSectionTypes(false)}else{setSectionTypes(true)}}}/>
                    <CachedIcon className="hero-cursor-pointer ms-3" onClick={()=>reloadAll()} />
                </h3>
              </div>

              {sectionTypes===true &&
                <div className="col-12 mb-3">
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            Id
                            <AddCircleIcon className="hero-cursor-pointer" fontSize="small" sx={{ml:1}} onClick={()=>toggleForm(1)} />
                          </TableCell>
                          <TableCell>Nom</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {videoTypes.map((type, index) => (
                        <TableRow
                          key={index}
                        >
                          <TableCell component="th" scope="row">{type.id}</TableCell>
                          <TableCell>{type.name}</TableCell>
                          <TableCell>
                            <Button variant="contained" size="small" color="info" onClick={()=>toggleForm(1, index)}>
                              Modifier
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              }

              <div className="col-12 mb-3">
                <TableContainer component={Paper} >
                  <Table className="striped">
                    <TableHead sx={{ fontWeight: 'bold'}}>
                      <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Titre</TableCell>
                        <TableCell>Photo</TableCell>
                        <TableCell>Actors</TableCell>
                        <TableCell>Durée</TableCell>
                        <TableCell>Date de sortie</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Date d'ajout</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        movies.map((movie, index)=>{
                          return (
                              <TableRow key={index} hover={true} className={index===movieIndex ? 'hero-bg-color-d781b3' : ''}>
                                  <TableCell >{movie.id}</TableCell>
                                  <TableCell>{movie.title}</TableCell>
                                  <TableCell>
                                      {movie.poster && <img src={`${process.env.AWS_FILE_PREFIX}${movie.poster.imageName}`} alt="" className="hero-width-170" />}
                                  </TableCell>
                                  <TableCell>
                                    {
                                      movie.actors.map((actor, index)=>{
                                        return (
                                          <Box component={'div'} key={index}>{actor.name}</Box>
                                        )
                                      })
                                    }
                                  </TableCell>
                                  <TableCell>{movie.duration}</TableCell>
                                  <TableCell>
                                      {movie.releasedAt !== null && moment(movie.releasedAt).format('DD/MM/YYYY')}
                                  </TableCell>
                                  <TableCell>{movie.type.name}</TableCell>
                                  <TableCell>
                                      {movie.createdAt !== null && moment(movie.createdAt).format('DD/MM/YYYY')}
                                  </TableCell>
                                  <TableCell>
                                      <PhotoIcon className="me-4 mb-4 hero-cursor-pointer" onClick={()=>toggleForm(3, index)}  />
                                      <ModeEditIcon className="hero-cursor-pointer me-4 mb-4" onClick={()=>toggleForm(2, index)} />
                                      <DeleteForeverIcon className="hero-cursor-pointer hover:hero-color-ff0000 mb-4" onClick={()=>alertDeleteMovie(index)} />
                                  </TableCell>
                              </TableRow>
                          );
                        })
                      }
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
            aria-describedby="modal-modal-description"
        >
          <Box sx={getModalStyle()} onClick={(e)=>e.stopPropagation()}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 4}}>
                {formType===1 && `Editer un type`}
                {formType===2 && `${movieIndex === null ? 'Ajouter' : 'Modifier'} une video`}
                {formType===3 && `Ajouter une image`}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                {formType === 1 && (
                  <>
                    <TextField
                        label='Nom *'
                        type='text'
                        fullWidth={true}
                        sx={{mb: 2}}
                        size="small"
                        {...register('name', {required: "Le champs est obligatoire"})}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                  </>
                )}
                {formType === 2 && (
                  <>
                    <TextField
                        label='Titre *'
                        type='text'
                        fullWidth={true}
                        sx={{mb: 4}}
                        {...register('title', {required: "Le champs est obligatoire"})}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />
                    <Grid container spacing={1} sx={{mb: 3}}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label='Date de sortie'
                          type='date'
                          InputLabelProps={{shrink: true}}
                          fullWidth={true}
                          sx={{mb: 2}}
                          {...register('releasedAt')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label='Durée'
                          type='number'
                          fullWidth={true}
                          sx={{mb: 2}}
                          {...register('duration')}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{mb: 4}}>
                      <Controller
                        control={control}
                        name={"actors"}
                        rules={{
                          validate: (value) => value.length > 0 || "Il faut au moins un acteur", // Custom validation rule
                        }}
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            sx={{ mb: 2 }}
                            options={actors}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              field.onChange(newValue.map((item) => item.id));
                            }}
                            value={actors.filter((actor) => field.value.includes(actor.id))}
                            renderOption={(props, option) => (
                              <Box component="li" {...props} display="flex" alignItems="center" key={option.id}>
                                {option.currentPhoto &&
                                  <img
                                    src={`${process.env.AWS_FILE_PREFIX}${option.currentPhoto.imageName}`}
                                    alt={option.name}
                                    style={{ width: 60, marginRight: 10 }}
                                  />
                                }
                                <span>{option.name}</span>
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Acteurs *"
                                error={!!errors.actors}
                                helperText={errors.actors?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                    <FormControl 
                      fullWidth
                      error={!!errors.type}
                      sx={{ mb: 4 }}
                    >
                      <InputLabel id="demo-simple-select-label">Type</InputLabel>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'Le champ est obligatoire' }} // Validation rules
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type"
                          >
                            {videoTypes.map((type) => (
                              <MenuItem value={type.id} key={type.id}>
                                {type.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.type && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2, display: 'block' }}
                        >
                          {errors.type.message}
                        </Typography>
                      )}
                    </FormControl>
                    <TextField
                      label="Lien *"
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                      sx={{mb: 4}}
                      size="small"
                      {...register('link', {required: "Le champs est obligatoire"})}
                      error={!!errors.link}
                      helperText={errors.link?.message}
                    />
                  </>
                )}
                {formType === 3 && (
                  <>
                    <Box component="div" sx={{mb: 2}}>
                      <Controller
                        control={control}
                        name={"imageFile"}
                        rules={{ 
                          required: "The picture is required",
                          validate: (value) => {
                            if (value) {
                                if(!isImageFile(value)) return 'This is not an image';
                            }
                          },
                        }}
                        render={({ field: { value, onChange, ...field } }) => {
                          return (
                            <Input
                              {...field}
                              onChange={(event) => {
                                  onChange(event.target.files[0]);
                              }}
                              type="file"
                              id="imageFile"
                              inputProps={{accept: "image/*"}}
                              fullWidth="true"
                            />
                          );
                        }}
                      />
                      {errors.imageFile && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, display: "block" }}
                        >
                          {errors.imageFile.message}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
                <Button variant="contained" type='submit'>Envoyer</Button>
            </form>
          </Box>
        </Modal>

        <Dialog
          open={openAlert}
          onClose={handleCloseAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{alertContent}</DialogContentText>
          </DialogContent>
          <DialogActions className="d-flex justify-content-between align-items-center">
            <Button onClick={()=>{deleteMovie(movies[movieIndex].id);handleCloseAlert()}} autoFocus color="error">Oui</Button>
            <Button onClick={handleCloseAlert}>Non</Button>
          </DialogActions>
        </Dialog>
      </>
  );
}
export default AdminMovie;