import React, {useState, useEffect} from 'react';
import './App.scss';
import RoutesWrapper from './routes/RoutesWrapper';
import useUserStore from './stores/userStore';
import { setLogin, getAuth } from './stores/userStore';
import Banner from './components/banner/Banner';
import { Modal } from 'bootstrap';
import { useForm } from "react-hook-form";
import useLoaderStore from './stores/loaderStore';

function App() {
    const { user, login } = useUserStore();
    const [loginModal, setLoginModal] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [passwordType, setPasswordType] = useState('password');
    const { loader } = useLoaderStore();

    useEffect(() => {
        setLoginModal(new Modal('#loginModal', {
            keyboard: false
        }));
    }, []);

    useEffect(() => {
        if(login === true) {
            loginModal.show();
            resetLoginForm();
        }
    }, [login]);

    const resetLoginForm = () => {
        reset({
            email: null,
            password: null
        });
    }

    const onSubmit = (data) => {
        getAuth(data)
    }

    return (
        <>
            <Banner />
            <RoutesWrapper />

            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" onClick={()=>setLogin(false)}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header justify-content-between align-items-center">
                            <h1 className="modal-title fs-5" id="loginModalLabel">Connecte-toi</h1>
                            <div className="hero-cursor-pointer" data-bs-dismiss="modal" aria-label="Close">X</div>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <form onSubmit={handleSubmit(onSubmit)} className="row">
                                    <div className="col-12 mb-3">
                                        <label htmlFor="email" className="form-label">Mail*</label>
                                        <input type="email" className="form-control" id="email" name="email" {...register("email", { required: { value: true, message: 'Le champ est obligatoire'}, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}/>
                                        {errors.password?.type === 'required' && <div className="alert alert-danger mt-1">{errors.email.message}</div>}
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
        </>
    )
}
export default App