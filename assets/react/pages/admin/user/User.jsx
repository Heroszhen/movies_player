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
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const AdminUser = (props) => {
    const {user, users, getUsers} = useUserStore();
    const [formType, setFormType] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (user !== null) {
            getUsers();
        }
    }, [user]);

    return (
        <>
            <section id="admin-users" className="vidoe">
                <div className="container pt-3">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <h3 className="d-flex align-items-center">
                                Utilisateurs
                                <AddCircleIcon className="hero-cursor-pointer ms-2" onClick={()=>setOpen(true)} />
                            </h3>
                        </div>
                        {
                            users.map((account, index)=>{
                                return (
                                    <div className="col-12 col-md-4 col-lg-3 text-center mb-4" key={index}>
                                        <Card sx={{ maxWidth: 345, margin:'auto' }}>
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
                                                <Button size="small" color="primary">
                                                    Modifer
                                                </Button>
                                                <PhotoIcon className="hero-cursor-pointer" />
                                                <Button size="small" color="error">
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
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
                </Box>
            </Modal>
        </>
    );
}
export default AdminUser;