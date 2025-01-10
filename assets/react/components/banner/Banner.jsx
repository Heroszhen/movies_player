import {useEffect} from 'react';
import './Banner.scss';
import useUserStore from '../../stores/userStore';
import Nav from '../nav/nav';
import { useLocation } from "react-router-dom";

const Banner = (props) => {
    const { user } = useUserStore();
    const reactLocation = useLocation();
    
    return (
        <section id="banner" className="position-relative">
            <Nav user={user} />
            <img src="/build/static/ad.png" alt="" className="w-100" />
            <h1 className="position-absolute top-50 w-100 d-flex justify-content-center align-items-center text-white">
                {reactLocation.pathname === "/" && "Bienvenue"}
                {reactLocation.pathname === "/about" && "Qui somme nous?"}
                {reactLocation.pathname === "/contact" && "Contactez-nous"}
            </h1>
        </section>
    );
}
export default Banner;