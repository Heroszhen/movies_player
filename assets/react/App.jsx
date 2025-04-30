import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import RoutesWrapper from './routes/RoutesWrapper';
import useUserStore from './stores/userStore';
import { setLogin, getAuth, getUser } from './stores/userStore';
import { Modal } from 'bootstrap';
import { useForm } from 'react-hook-form';
import useLoaderStore from './stores/loaderStore';
import { Alert, Snackbar } from '@mui/material';
import parse from 'html-react-parser';
import { useLocation, useNavigate } from 'react-router-dom';
import useMovieStore from './stores/movieStore';

import Banner from './components/banner/Banner';
import Loader from './components/loader/loader';
import Footer from './components/footer/Footer';
import Notifier from './components/notifier/Notifier';

//admin
import AdminNav from './components/admin_nav/AdminNav';
import AdminHeader from './components/admin_header/AdminHeader';

function App() {
  const { emptyMovies } = useMovieStore();
  const { user, login } = useUserStore();
  const [loginModal, setLoginModal] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
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
  };
  const reactLocation = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const adminNavRef = useRef(null);
  const [precRoute, setPrecRoute] = useState(null);
  const [canQuery, setCanQuery] = useState(false);

  useEffect(() => {
    window.fetch = async (...args) => {
      setLoader(true);

      const [url, options = {}] = args;
      if (options.method.toLowerCase() === 'patch') {
        options.headers['Content-Type'] = 'application/merge-patch+json';
      }
      const response = await originalFetch.apply(this, [url, options]);

      setLoader(false);

      const clonedResponse = response.clone();
      if (clonedResponse.ok === false) {
        setAlertDuration(5000);
        setAlertSeverity('error');
        try {
          const jsonResponse = await clonedResponse.json();
          let msg = '';
          if (jsonResponse.message) msg += jsonResponse.message + '<br>';
          if (jsonResponse.violations) {
            for (let entry of jsonResponse.violations) {
              msg += `${entry['propertyPath']} : ${entry['message']}<br>`;
            }
          }
          if (jsonResponse['hydra:description']) msg += jsonResponse['hydra:description'] + '<br>';
          setAlertMessages(msg);
          setOpenAlert(true);
        } catch (e) {
          console.error('Error occurred:', e); // Log the error
        } finally {
          if (clonedResponse.status === 401 && reactLocation.pathname !== '/') navigate('/');
        }
      } else if (reactLocation.pathname.includes('admin')) {
        setAlertDuration(1000);
        setAlertSeverity('success');
        setAlertMessages('Envoyé');
        setOpenAlert(true);
      }
      return response;
    };
    setCanQuery(true);

    if (user === null && localStorage.getItem('token') !== null) {
      getUser();
    }

    setLoginModal(new Modal('#loginModal', { keyboard: false }));
  }, []);

  useEffect(() => {
    if (login === true) {
      resetLoginForm();
      loginModal.show();
    } else {
      loginModal?.hide();
    }
  }, [login]);

  useEffect(() => {
    if (reactLocation.pathname !== precRoute) emptyMovies();
    setPrecRoute(reactLocation.pathname);
  }, [reactLocation]);

  const resetLoginForm = () => {
    reset({
      email: null,
      password: null,
    });
  };

  const onSubmit = async (data) => {
    localStorage.removeItem('token');
    const response = await getAuth(data);
    if (response === true) setLogin(false);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const toggleAdminNav = () => {
    mainRef.current.classList.toggle('admin-nav-close');
    adminNavRef.current.classList.toggle('d-none');
  };

  return (
    <>
      {!reactLocation.pathname.includes('admin') && <Banner />}
      {reactLocation.pathname.includes('admin') && <AdminHeader mainRef={mainRef} adminNavRef={adminNavRef} />}
      {reactLocation.pathname.includes('admin') && <AdminNav ref={adminNavRef} toggleAdminNav={toggleAdminNav} />}
      <main ref={mainRef}>
        <RoutesWrapper canQuery={canQuery} />
      </main>
      {!reactLocation.pathname.includes('admin') && <Footer />}

      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        onClick={() => setLogin(false)}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header justify-content-between align-items-center">
              <h1 className="modal-title fs-5" id="loginModalLabel">
                Connecte-toi
              </h1>
              <div
                className="hero-cursor-pointer"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setLogin(false)}>
                X
              </div>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <form onSubmit={handleSubmit(onSubmit)} className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">
                      Mail*
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      {...register('email', {
                        required: { value: true, message: 'Le champ est obligatoire' },
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      })}
                    />
                    {errors.email?.type === 'required' && (
                      <div className="alert alert-danger mt-1">{errors.email?.message}</div>
                    )}
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="password" className="form-label">
                      Mot de passe*
                    </label>
                    <div className="input-group">
                      <input
                        type={passwordType}
                        className="form-control"
                        id="password"
                        name="password"
                        autoComplete="off"
                        {...register('password', { required: { value: true, message: 'Le champ est obligatoire' } })}
                      />
                      <span
                        className="input-group-text hero-cursor-pointer"
                        id="basic-eye"
                        onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}>
                        <i className="bi bi-eye-fill"></i>
                      </span>
                    </div>
                    {errors.password?.type === 'required' && (
                      <div className="alert alert-danger mt-1">{errors.password.message}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-movify">
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loader && <Loader />}

      <Snackbar anchorOrigin={snackbarPosition} open={openAlert} autoHideDuration={alertDuration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} variant="filled" sx={{ width: '100%' }}>
          {parse(alertMessages)}
        </Alert>
      </Snackbar>

      <Notifier pathname={reactLocation.pathname} user={user} />
    </>
  );
}
export default App;
