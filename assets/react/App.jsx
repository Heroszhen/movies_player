import React, {useState, useEffect} from 'react';
import './App.scss';
import RoutesWrapper from './routes/RoutesWrapper';
import useUserStore from './stores/userStore';
import { setLogin, getAuth, getUser } from './stores/userStore';
import { Modal } from 'bootstrap';
import { useForm } from "react-hook-form";
import useLoaderStore from './stores/loaderStore';
import { Alert, Snackbar } from '@mui/material';
import parse from 'html-react-parser';

import Banner from './components/banner/Banner';
import Loader from './components/loader/loader';
import Footer from './components/footer/Footer';

function App() {
    const { user, login } = useUserStore();
    const [loginModal, setLoginModal] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [passwordType, setPasswordType] = useState('password');
    const { loader, setLoader } = useLoaderStore();
    const { fetch: originalFetch } = window;
    const [openAlert, setOpenAlert] = useState(false);
    const [alertDuration, setAlertDuration] = useState(5000);
    //success, error
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [alertMessages, setAlertMessages] = useState('');
    const snackbarPosition = {
        vertical: 'top',
        horizontal: 'right',
    }

    useEffect(() => {
        window.fetch = async (...args) => {
            setLoader(true);
            const response = await originalFetch.apply(this, args);
            setLoader(false);
            if (!response.url.includes('http')) {
                const clonedResponse = response.clone();
                if (clonedResponse.ok === false) {
                    setAlertDuration(10000);
                    setAlertSeverity('error');
                    try {
                        const jsonResponse = await clonedResponse.json();
                        let msg = '';
                        if (jsonResponse.message)msg += jsonResponse.message + "<br>";
                        if (jsonResponse.violation) {
                            for(let entry of jsonResponse.violation) {
                                msg += `${entry['propertyPath']} : ${entry['message']}<br>`;
                            }
                        }
                        setAlertMessages(msg);
                    } catch(e) {}
                } else {
                    setAlertDuration(2000);
                    setAlertSeverity('success');
                    setAlertMessages('Envoyé');
                }
                setOpenAlert(true);
            }

            return response;
        };

        if (user === null && localStorage.getItem('token') !== null) {
            getUser();
        }

        setLoginModal(new Modal('#loginModal', {
            keyboard: false
        }));
    }, []);

    useEffect(() => {
        if(login === true) {
            resetLoginForm();
            loginModal.show();
        } else {
            loginModal?.hide();
        }
    }, [login]);

    const resetLoginForm = () => {
        reset({
            email: null,
            password: null
        });
    };

    const onSubmit = async (data) => {
        localStorage.removeItem('token');
        const response = await getAuth(data);
        if (response === true)setLogin(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <>
            <Banner />
            <RoutesWrapper />
            <Footer />

            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header justify-content-between align-items-center">
                            <h1 className="modal-title fs-5" id="loginModalLabel">Connecte-toi</h1>
                            <div className="hero-cursor-pointer" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setLogin(false)}>X</div>
                        </div>
                        <div className="modal-body" onClick={(e)=>e.stopPropagation()}>
                            <div className="container-fluid">
                                <form onSubmit={handleSubmit(onSubmit)} className="row">
                                    <div className="col-12 mb-3">
                                        <label htmlFor="email" className="form-label">Mail*</label>
                                        <input type="email" className="form-control" id="email" name="email" {...register("email", { required: { value: true, message: 'Le champ est obligatoire'}, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}/>
                                        {errors.email?.type === 'required' && <div className="alert alert-danger mt-1">{errors.email?.message}</div>}
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label htmlFor="password" className="form-label">Mot de passe*</label>
                                        <div className="input-group">
                                            <input type={passwordType} className="form-control" id="password" name="password"
                                            autoComplete="off" 
                                            {...register("password", { required: { value: true, message: 'Le champ est obligatoire'} })}
                                            />
                                            <span className="input-group-text hero-cursor-pointer" id="basic-eye"
                                                onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password') }
                                            >
                                                <i className="bi bi-eye-fill"></i>
                                            </span>
                                        </div>
                                        {errors.password?.type === 'required' && <div className="alert alert-danger mt-1">{errors.password.message}</div>}
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-movify">Envoyer</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loader && <Loader />}
            
            <Snackbar anchorOrigin={snackbarPosition} open={openAlert} autoHideDuration={alertDuration} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={alertSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {parse(alertMessages)}
                </Alert>
            </Snackbar>
        </>
    )
}
export default App