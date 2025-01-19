import {useState, useEffect} from 'react';
import './User.scss';
import useUserStore from '../../../stores/userStore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PhotoIcon from '@mui/icons-material/Photo';
import Modal from '@mui/material/Modal';
import { getModalStyle } from '../../../services/data';
import { useForm, Controller } from "react-hook-form";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { TextField, Checkbox, FormControlLabel, InputLabel, InputAdornment, IconButton, FormControl, OutlinedInput,  Input } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { isImageFile } from '../../../services/utils';
import { addFile } from '../../../stores/fileStore';

const AdminUser = (props) => {
    const {user, users, getUsers, editUser, deleteUser, updatePassword} = useUserStore();
    const [formType, setFormType] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [userIndex, setUserIndex] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, getValues, setValue, control } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        if (user !== null) {
            getUsers();
        }
    }, [user]);

    const toggleForm = (type = null, index = null) => {

        if (type === null) {
            handleClose();
        } else {
            if (type === 1) {
                reset({
                    email: index === null ? null : users[index].email,
                    isAdmin: index !== null && users[index].roles.includes('ROLE_ADMIN') ? true : false
                });
            }
            if (type === 2) {
                reset({
                    imageFile: null
                });
            }
            if (type === 3) {
                reset({
                    plainPassword: null
                });
            }
            handleOpen();
        }
        setFormType(type);
        setUserIndex(index);
    }

    const onSubmit = async (data) => {
        if (formType === 1) {
            data['roles'] = ['ROLE_USER'];
            if (data['isAdmin'] === true)data['roles'].push('ROLE_ADMIN');
            editUser(data, userIndex === null ? null : users[userIndex].id)
        }
        if (formType === 2) {
            const photo = await addFile(data.imageFile);
            if (photo['@id'])editUser({photo: photo['@id']}, users[userIndex].id);
        }
        if (formType === 3) {
            updatePassword(data, users[userIndex].id)
        }
    }

    const removeUser = (index) => {
        if (users[index].id !== 1) {
            deleteUser(users[index].id);
        }
    }

    return (
        <>
            <section id="admin-users" className="vidoe">
                <div className="container pt-3">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <h3 className="d-flex align-items-center">
                                Utilisateurs
                                <AddCircleIcon className="hero-cursor-pointer ms-2" onClick={()=>toggleForm(1)} />
                            </h3>
                        </div>
                        {
                            users.map((account, index)=>{
                                return (
                                    <div className="col-12 col-md-4 col-lg-3 text-center mb-4" key={index}>
                                        <Card sx={{ width: '100%', margin:'auto' }}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={account.photo ? `${process.env.AWS_FILE_PREFIX}${account.photo.imageName}` : '/build/static/poster_not_found.png'}
                                                    alt=""
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {account.email}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} component="div">
                                                        <Box component="section">
                                                            {account.roles.join(', ')}
                                                        </Box>
                                                        <Box component="section">
                                                            {account.createdAt}
                                                        </Box>
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions className="d-flex justify-content-between">
                                                <Button size="small" color="primary" onClick={()=>toggleForm(1, index)}>
                                                    Modifer
                                                </Button>
                                                <PhotoIcon className="hero-cursor-pointer" onClick={()=>toggleForm(2, index)} />
                                                <VpnKeyIcon className="hero-cursor-pointer" onClick={()=>toggleForm(3, index)} />
                                                <Button size="small" color="error" onClick={()=>removeUser(index)}>
                                                    Supprimer
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </div>
                                )
                            })
                        }
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
                        {formType===1 && 'Editer un compte'}
                        {formType===2 && 'Editer une photo de profil'}
                        {formType===3 && 'Modifier un mot de passe'}
                    </Typography>
                    {formType===1 &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label='Mail *'
                                type='email'
                                fullWidth={true}
                                sx={{mb: 2}}
                                size="small"
                                {...register('email', {
                                    required: "Le champs est obligatoire"
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <Box component="div">
                                <FormControlLabel
                                    label="Administrateur"
                                    sx={{mb: 2}}
                                    control={
                                        <Controller
                                            name="isAdmin" 
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    {...field}
                                                />
                                            )}
                                    />
                                    }
                                />
                            </Box>
                            <Button variant="contained" type='submit'>Envoyer</Button>
                        </form>
                    }
                    {formType===2 &&
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Button variant="contained" type='submit'>Envoyer</Button>
                        </form>
                    }
                    {formType===3 &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box component="div">
                                <FormControl sx={{ mb: 2, width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Mot the passe*</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        size="small"
                                        {...register('plainPassword', {
                                            required: "Le champs est obligatoire"
                                        })}
                                        error={!!errors.plainPassword}
                                        helpertext={errors.plainPassword?.message}
                                    />
                                </FormControl>
                            </Box>
                            <Button variant="contained" type='submit'>Envoyer</Button>
                        </form>
                    }
                </Box>
            </Modal>
        </>
    );
}
export default AdminUser;