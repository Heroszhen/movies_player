import { useState, useEffect, useRef } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useActorStore from '../../../stores/actorStore';
import usePaginatorStore, { setRoute, setPage, setKeywords, getPaginator } from '../../../stores/paginatorStore'; 
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
    Grid
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PhotoIcon from '@mui/icons-material/Photo';
import { getModalStyle, editorToolbarConfig } from '../../../services/data';
import { useForm, Controller } from 'react-hook-form';
import moment from "moment";
import FileForm from '../../../components/file_form/FileForm';
import Editor from '../../../components/editor/Editor';

const AdminActor = (props) => {
    const {actors, getActors, editActor} = useActorStore();
    const reactLocation = useLocation();
    const [formType, setFormType] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [actorIndex, setActorIndex] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();
    const bc = new BroadcastChannel('admin_movie');
    const editorRef = useRef(null);
   
    useEffect(() => {
        getPaginator(reactLocation.pathname);
        setRoute(reactLocation.pathname);

        return () => {
            bc.close();
        }
    }, []);
    const { page, itemsPerPage, total, keywords, route } = usePaginatorStore();

    useEffect(() => {
        if (route === reactLocation.pathname) {
            getActors(page, keywords);
        }
    }, [page, keywords, route]);

    const handleChangePage = async (event, newPage) => {
        if(newPage !== page) {
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
            handleOpen();
        }
        setFormType(type);
        setActorIndex(index);
    }

    const onSubmit = async (data) => {
        if (formType === 1) {
            data.description = editorRef.current.getValue();
            await editActor(data, actorIndex === null ? null : actors[actorIndex].id);
        }
        if (formType === 2) {
            if (data['@id'])await editActor({currentPhoto: data['@id']}, actors[actorIndex].id);
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
                                                                <PhotoIcon className="me-4 mb-3 hero-cursor-pointer"  onClick={()=>toggleForm(2, index)} />
                                                                <ModeEditIcon className="hero-cursor-pointer mb-3" onClick={()=>toggleForm(1, index)} />
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
                <Box sx={getModalStyle(1200)}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mb: 4}}>
                        {formType===1 && 'Editer un acteur'}
                        {formType===2 && 'Editer une photo de profil'}
                    </Typography>
                    {[1].includes(formType) &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {formType === 1 && (
                                <>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={4}>
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
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label='Pays'
                                                type='text'
                                                fullWidth={true}
                                                sx={{mb: 2}}
                                                size="small"
                                                {...register('country')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label='Date de naissance'
                                                type='date'
                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                sx={{mb: 2}}
                                                size="small"
                                                {...register('birthday')}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box sx={{mb: 2}}>
                                        <Editor 
                                            ref={editorRef}
                                            label="Description"
                                            value={getValues('description')}
                                        />
                                    </Box>
                                </>
                            )}
                            <Button variant="contained" type='submit'>Envoyer</Button>
                        </form>
                    }
                    {formType === 2 && <FileForm setFile={onSubmit} />}
                </Box>
            </Modal>
        </>
    );
}
export default AdminActor;