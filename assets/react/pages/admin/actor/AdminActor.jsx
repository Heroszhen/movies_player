import {useState, useEffect} from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useActorStore from '../../../stores/actorStore';
import useUserStore from '../../../stores/userStore';
import usePaginatorStore, { setRoute, setPage, setKeywords } from '../../../stores/paginatorStore'; 
import { useLocation } from "react-router-dom";
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
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PhotoIcon from '@mui/icons-material/Photo';
import { getModalStyle } from '../../../services/data';
import { Controller, useForm } from 'react-hook-form';
import moment from "moment";
import { addFile } from '../../../stores/fileStore';
import { isImageFile } from '../../../services/utils';

const AdminActor = (props) => {
    const {actors, getActors, editActor} = useActorStore();
    const {user} = useUserStore();
    const reactLocation = useLocation();
    const [formType, setFormType] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [actorIndex, setActorIndex] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const bc = new BroadcastChannel('admin_movie');

    useEffect(() => {
        setRoute(reactLocation.pathname);

        return () => {
            bc.close();
        }
    }, []);
    const { page, itemsPerPage, total, keywords } = usePaginatorStore();

    useEffect(() => {
        if (user !== null) {
            getActors(page, keywords);
        }
    }, [user, page, keywords]);

    const handleChangePage = async (event, newPage) => {
        if(newPage !== page) {
            setPage(newPage);
        }
    };

    const toggleForm = (type = null, index = null) => {
        if (type === null) {
            handleClose();
        } else {
            if (type === 1) {
                reset({
                    name: index === null ? null : actors[index].name,
                    country: index === null ? null : actors[index].country,
                    birthday: index === null || !actors[index].birthday ? null : actors[index].birthday.split('T')[0]
                });
            }
            if (type === 2) {
                reset({
                    imageFile: null
                });
            }
            
            handleOpen();
        }
        setFormType(type);
        setActorIndex(index);
    }

    const onSubmit = async (data) => {
        if (formType === 1) {
           await editActor(data, actorIndex === null ? null : actors[actorIndex].id);
        }
        if (formType === 2) {
            const photo = await addFile(data.imageFile);
            if (photo['@id'])await editActor({currentPhoto: photo['@id']}, actors[actorIndex].id);
        }
        handleClose();
        bc.postMessage({data:'actor'});
    }

    const searchByKeywords = (e) => {
        if (e.type === 'keyup' && e.keyCode === 13) {
            setKeywords(e.target.value);
        } else if (e.type === 'change' && e.target.value === '') {
            setKeywords(e.target.value);
        }
    }

    return (
        <>
            <section id="admin-user" className="vidoe">
                <div className="container-fluid pt-3">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <h3 className="d-flex align-items-center">
                                    Acteurs
                                    <AddCircleIcon className="hero-cursor-pointer ms-2" onClick={()=>toggleForm(1)} />
                                </h3>
                            </div>
                            <div className="col-12 mb-3">
                                <Box component="div" sx={{mb: 2}}>
                                    <TextField
                                        type='search'
                                        fullWidth={true}
                                        placeholder='Rechercher...'
                                        size="small"
                                        onChange={(e)=>searchByKeywords(e)}
                                        onKeyUp={(e)=>searchByKeywords(e)}
                                    />
                                </Box>
                                <TableContainer component={Paper} >
                                    <Table className="striped">
                                        <TableHead sx={{ fontWeight: 'bold'}}>
                                            <TableRow>
                                                <TableCell>Id</TableCell>
                                                <TableCell>Nom</TableCell>
                                                <TableCell>Naissance</TableCell>
                                                <TableCell>Pays</TableCell>
                                                <TableCell>Photo</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                actors.map((actor, index)=>{
                                                    return (
                                                        <TableRow key={index} hover={true}>
                                                            <TableCell>{actor.id}</TableCell>
                                                            <TableCell>{actor.name}</TableCell>
                                                            <TableCell>
                                                                {actor.birthday && moment(actor.birthday).format('DD/MM/YYYY')}
                                                            </TableCell>
                                                            <TableCell>{actor.country}</TableCell>
                                                            <TableCell>
                                                                {actor.currentPhoto &&  <img src={`${process.env.AWS_FILE_PREFIX}${actor.currentPhoto.imageName}`} alt="" className="hero-width-120" />}
                                                            </TableCell>
                                                            <TableCell>
                                                                <PhotoIcon className="me-4 hero-cursor-pointer"  onClick={()=>toggleForm(2, index)} />
                                                                <ModeEditIcon className="hero-cursor-pointer" onClick={()=>toggleForm(1, index)} />
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
                <Box sx={getModalStyle()}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 4}}>
                        {formType===1 && 'Editer un acteur'}
                        {formType===2 && 'Editer une photo de profil'}
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
                                <TextField
                                    label='Pays'
                                    type='text'
                                    fullWidth={true}
                                    sx={{mb: 2}}
                                    size="small"
                                    {...register('country')}
                                />
                                <TextField
                                    label='Date de naissance'
                                    type='date'
                                    InputLabelProps={{shrink: true}}
                                    fullWidth={true}
                                    sx={{mb: 2}}
                                    size="small"
                                    {...register('birthday')}
                                />
                            </>
                        )}
                        {formType === 2 && (
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
        </>
    );
}
export default AdminActor;