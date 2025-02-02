import React, { useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useUserStore, { setLogin } from "../../stores/userStore";
import './Nav.scss';
import { Tooltip } from 'bootstrap';

const Nav = (props) => {
    const { user, setUser } = useUserStore();
    const collapseRef = useRef(null);
    const navigate = useNavigate();
    const reactLocation = useLocation();
    const [deferredPrompt, setDeferredPrompt] = useState(null)

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new Tooltip(tooltipTriggerEl);
        });

        window.addEventListener('beforeinstallprompt', (event) => {
            event?.preventDefault()
            setDeferredPrompt(event);
        });
    }, []);console.log(deferredPrompt)

    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate('/');
        window.location.reload();
    }

    const installApp = async () => {
        if (deferredPrompt === null)return;

        deferredPrompt.prompt();
        const {outcome: outcome, platform:platform} = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setDeferredPrompt(null);
        }
    }

    return (
        <nav className="navbar navbar-expand-md bg-transparent position-absolute top-0 w-100" id="client-nav">
            <div className="container">
                <Link to="/" className="navbar-brand  text-white hero-fs-25">{process.env.NAV_TITLE}</Link>
                <button className="navbar-toggler" type="button" onClick={()=>collapseRef.current.classList.toggle('show')}>
                    <i className="bi bi-justify"></i>
                </button>
                <div className="collapse navbar-collapse hero-fs-20 z-3 p-2" id="navbarSupportedContent" ref={collapseRef}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" onClick={()=>collapseRef.current.classList.remove('show')}>
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"}>
                                Accueil
                            </NavLink>
                        </li>
                        {user !== null &&
                            <li className="nav-item">
                                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"}>
                                    Contact
                                </NavLink>
                            </li>
                        }
                        {user !== null &&
                            <li className="nav-item">
                                <NavLink to="/videos" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Vidéos
                                </NavLink>
                            </li>
                        }
                        {user !== null &&
                            <li className="nav-item">
                                <NavLink to="/acteurs" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Acteurs
                                </NavLink>
                            </li>
                        }
                        {user?.roles.includes('ROLE_ADMIN') &&
                            <li className="nav-item">
                                <NavLink to="/admin/videos" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Admin
                                </NavLink>
                            </li>
                        }
                    </ul>
                    <div className="d-flex align-items-center">
                        <i className="bi bi-arrow-clockwise hero-cursor-pointer text-white me-3" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Actualiser" onClick={()=>location.reload()}></i>
                        {deferredPrompt !== null && 
                            <i className="bi bi-download hero-cursor-pointer text-white me-3" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Installer" onClick={()=>installApp()}></i>
                        }
                        {user === null &&
                            <button type="button" className='btn btn-movify btn-sm ms-2' onClick={()=>setLogin(true)}>Connexion</button>
                        }
                        {user !== null &&
                            <button type="button" className='btn btn-outline-dark btn-sm ms-2' onClick={()=>logout()}>Déconnexion</button>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Nav;