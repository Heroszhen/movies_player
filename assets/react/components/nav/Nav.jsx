import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useUserStore, { setLogin } from "../../stores/userStore";
import './Nav.scss';

const Nav = (props) => {
    const { user, setUser } = useUserStore();
    const collapseRef = useRef(null);
    const navigate = useNavigate();
    const reactLocation = useLocation();

    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate('/');
        window.location.reload();
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
                        {/* {user !== null &&
                            <li className="nav-item">
                                <NavLink to="/acteurs" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Acteurs
                                </NavLink>
                            </li>
                        } */}
                        {user?.roles.includes('ROLE_ADMIN') &&
                            <li className="nav-item">
                                <NavLink to="/admin/utilisateurs" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Admin
                                </NavLink>
                            </li>
                        }
                    </ul>
                    <div className="d-flex">
                        {user === null &&
                            <button type="button" className='btn btn-movify btn-sm me-2' onClick={()=>setLogin(true)}>Connexion</button>
                        }
                        {user !== null &&
                            <button type="button" className='btn btn-outline-dark btn-sm me-2' onClick={()=>logout()}>Déconnexion</button>
                        }
                        <button type="button" className='btn btn-outline-info btn-sm text-white me-2' onClick={()=>location.reload()}>Actualiser</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Nav;