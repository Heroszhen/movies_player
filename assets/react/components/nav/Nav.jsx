import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { setLogin } from "../../stores/userStore";

const Nav = (props) => {

    return (
        <nav className="navbar navbar-expand-md bg-transparent">
            <div className="container">
                <Link to="/" className="navbar-brand">{process.env.NAV_TITLE}</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Accueil
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                A propos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Contact
                            </NavLink>
                        </li>
                        {props.user?.roles.includes('ROLE_ADMIN') &&
                            <li className="nav-item">
                                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
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