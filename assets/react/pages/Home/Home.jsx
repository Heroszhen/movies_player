import React, { useState, useEffect } from 'react';
import { getCounts, getLastThreeMovies } from '../../services/api';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../../services/utils';
import useConfigStore from '../../stores/configStore';

const Home = () => {
  const [counts, setCounts] = useState(null);
  const [movies, setMovies] = useState(null);
  const navigate = useNavigate();
  const { config } = useConfigStore();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    getCounts()
      .then((response) => response.json())
      .then((response) => {
        if (response?.data) setCounts(response.data);
      });

    getLastThreeMovies()
      .then((response) => response.json())
      .then((response) => {
        if (response && response['hydra:member']) setMovies(response['hydra:member']);
      });
  };

  const canShowNews = (type) => {
    if (config === null) return false;

    if (type === 1 && !isEmpty(config.news1Title) && !isEmpty(config.news1Content) && !isEmpty(config.news1Photo)) {
      return true;
    }

    if (type === 2 && !isEmpty(config.news2Title) && !isEmpty(config.news2Content) && !isEmpty(config.news2Photo)) {
      return true;
    }

    if (type === 3 && !isEmpty(config.news3Title) && !isEmpty(config.news3Content) && !isEmpty(config.news3Photo)) {
      return true;
    }

    return false;
  };

  return (
    <section id="home">
      <section className="bg-[#edf5f7] pt-5 pb-5 text-center">
        <h2>Bienvenue à {process.env.NAV_TITLE}</h2>
      </section>

      {counts !== null && (
        <section id="wrap-counts" className="text-white pt-5 pb-5 hero-fs-30">
          <div className="container">
            <div className="row">
              <div className="col-md-4 text-center text-center mb-3">
                {counts.movies}
                <br />
                Vidéos
              </div>
              <div className="col-md-4 text-center text-center mb-3">
                {counts.actors}
                <br />
                Acteurs
              </div>
              <div className="col-md-4 text-center text-center">
                {counts.users}
                <br />
                Utilisateurs
              </div>
            </div>
          </div>
        </section>
      )}

      {movies && (
        <section className="hero-p-top-100 hero-p-bottom-100" id="wrap-movies">
          <h2 className="mb-5 text-center">Les nouvelles vidéos</h2>
          <div className="container">
            <div className="row">
              {movies.map((movie, index) => {
                return (
                  <article className="col-12 col-md-6 col-lg-3 wrap-image mb-3" key={index}>
                    {movie.poster && (
                      <img
                        src={`${process.env.AWS_FILE_PREFIX}${movie.poster.imageName}`}
                        alt=""
                        className="hero-cursor-pointer"
                        onClick={() => navigate(`video/${movie.id}`)}
                      />
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="hero-bg-color-e7edef p-5 text-center">
        <h2>Inscris-toi!</h2>
        <div className="input-group mt-5 max-w-[600px] mx-auto">
          <input type="text" className="form-control" placeholder="Ton mail" />
          <button type="button" className="btn btn-movify input-group-text" id="basic-addon2">
            Mail
          </button>
        </div>
      </section>

      <section className="bg-[#edf5f7] pt-[100px] pb-[100px] text-center">
        <div className="container-fluid">
          <div className="row justify-content-evenly">
            {canShowNews(1) && (
              <div className="mb-2 col-12 col-md-4 col-lg-3">
                <div className="card">
                  <img
                    src={`${process.env.AWS_FILE_PREFIX}${config.news1Photo.imageName}`}
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">{config.news1Title}</h5>
                    <p className="card-text">{config.news1Content}</p>
                  </div>
                </div>
              </div>
            )}
            {canShowNews(2) && (
              <div className="mb-2 col-12 col-md-4 col-lg-3">
                <div className="card">
                  <img
                    src={`${process.env.AWS_FILE_PREFIX}${config.news2Photo.imageName}`}
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">{config.news2Title}</h5>
                    <p className="card-text">{config.news2Content}</p>
                  </div>
                </div>
              </div>
            )}
            {canShowNews(3) && (
              <div className="mb-2 col-12 col-md-4 col-lg-3">
                <div className="card">
                  <img
                    src={`${process.env.AWS_FILE_PREFIX}${config.news3Photo.imageName}`}
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">{config.news3Title}</h5>
                    <p className="card-text">{config.news3Content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};
export default Home;
