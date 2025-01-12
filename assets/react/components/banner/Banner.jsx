import React, {useEffect} from 'react';
import './Banner.scss';
import Nav from '../nav/nav';
import { useLocation } from "react-router-dom";

const Banner = (props) => {
    const reactLocation = useLocation();

    const displayBanner = () => {
        if (!reactLocation.pathname.includes('admin') && 
            !reactLocation.pathname.includes('/video') &&
            !reactLocation.pathname.includes('/acteur')
        ){
            return <img src="/build/static/ad.png" alt="" className="w-100" />;
        } 
        return <img src="/build/static/fire.png" alt="" className="w-100" />
    }

    return (
        <section id="banner" className="position-relative">
            <Nav />
            {displayBanner()}
            <h1 className="position-absolute top-50 w-100 d-flex justify-content-center align-items-center text-white">
                {reactLocation.pathname === "/" && "Bienvenue"}
                {reactLocation.pathname === "/about" && "Qui somme nous?"}
                {reactLocation.pathname === "/contact" && "Contactez-nous"}
            </h1>
        </section>
    );
}
export default Banner;