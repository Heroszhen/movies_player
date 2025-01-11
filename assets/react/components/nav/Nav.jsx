import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import useUserStore, { setLogin } from "../../stores/userStore";

const Nav = (props) => {
    const { user, setUser } = useUserStore();
    const collapseRef = useRef(null);
    const navigate = useNavigate();

    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate('/');
    }

    return (
        <nav className="navbar navbar-expand-md bg-transparent position-absolute top-0 w-100">
            <div className="container">
                <Link to="/" className="navbar-brand  text-white hero-fs-25">{process.env.NAV_TITLE}</Link>
                <button className="navbar-toggler" type="button" onClick={()=>collapseRef.current.classList.toggle('show')}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse hero-fs-20" id="navbarSupportedContent" ref={collapseRef}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"}>
                                Accueil
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"}>
                                A propos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"}>
                                Contact
                            </NavLink>
                        </li>
                        {user !== null &&
                            <li className="nav-item">
                                <NavLink to="/videos" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Vidéos
                                </NavLink>
                            </li>
                        }
                        {user !== null &&
                            <li className="nav-item">
                                <NavLink to="/actrices" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Actrices
                                </NavLink>
                            </li>
                        }
                        {user?.roles.includes('ROLE_ADMIN') &&
                            <li className="nav-item">
                                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Admin
                                </NavLink>
                            </li>
                        }
                    </ul>
                    <div className="d-flex">
                        {user === null &&
                            <button type="button" className='btn btn-movify btn-sm' onClick={()=>setLogin(true)}>Connexion</button>
                        }
                        {user !== null &&
                            <button type="button" className='btn btn-dark btn-sm' onClick={()=>logout()}>Déconnexion</button>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Nav;