import React from 'react';
import './Banner.scss';
import Nav from '../nav/nav';
import { useLocation } from 'react-router-dom';
import useConfigStore from '../../stores/configStore';

const Banner = () => {
  const reactLocation = useLocation();
  const { config } = useConfigStore();

  const displayBanner = () => {
    if (
      !reactLocation.pathname.includes('admin') &&
      !reactLocation.pathname.includes('/video') &&
      !reactLocation.pathname.includes('/acteur') &&
      !reactLocation.pathname.includes('/categorie')
    ) {
      if (!config?.bannerPhoto?.imageName) {
        return;
      }

      return (
        <img
          src={`${process.env.AWS_FILE_PREFIX}${config.bannerPhoto.imageName}`}
          alt=""
          className="w-100 hero-minh-60"
        />
      );
    }
    return <img src="/build/static/fire.png" alt="" className="w-100 hero-maxh-100 hero-minh-60" />;
  };

  return (
    <section id="banner" className="position-relative">
      <Nav />
      {displayBanner()}
      <h1 className="position-absolute top-50 w-100 d-flex justify-content-center align-items-center text-white">
        {reactLocation.pathname === '/' && 'Bienvenue'}
        {reactLocation.pathname === '/about' && 'Qui somme nous?'}
        {reactLocation.pathname === '/contact' && 'Contactez-nous'}
      </h1>
    </section>
  );
};
export default Banner;
