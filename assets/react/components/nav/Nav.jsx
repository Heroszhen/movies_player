import { useRef } from 'react';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { setLogin } from "../../stores/userStore";

const Nav = (props) => {
    const collapseRef = useRef(null);

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
                        {props.user !== null &&
                            <li className="nav-item">
                                <NavLink to="/videos" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Vidéos
                                </NavLink>
                            </li>
                        }
                        {props.user !== null &&
                            <li className="nav-item">
                                <NavLink to="/actrices" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Actrices
                                </NavLink>
                            </li>
                        }
                        {props.user?.roles.includes('ROLE_ADMIN') &&
                            <li className="nav-item">
                                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link text-white  active" : "nav-link text-white "}>
                                    Admin
                                </NavLink>
                            </li>
                        }
                    </ul>
                    <div className="d-flex">
                        {props.user === null &&
                            <button type="button" className='btn btn-movify btn-sm' onClick={()=>setLogin(true)}>Login</button>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Nav;