import React, { useState, useEffect } from 'react';
import { getCounts, getLastThreeMovies } from '../../services/api';
import './Home.scss';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [counts, setCounts] = useState(null);
  const [movies, setMovies] = useState(null);
  const navigate = useNavigate();

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
                Films
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
        <section className="hero-p-top-100 hero-p-bottom-100 d-flex justify-content-center" id="wrap-movies">
          {movies.map((movie, index) => {
            return (
              <article className="wrap-image mb-3" key={index}>
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
    </section>
  );
};
export default Home;
