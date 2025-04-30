import React, { useState, useEffect } from 'react';
import { getCounts, getLastThreeMovies } from '../../services/api';
import useUserStore from '../../stores/userStore';
import './Home.scss';

const Home = () => {
  const { user } = useUserStore();
  const [counts, setCounts] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (user !== null) {
      getData();
    }
  }, [user]);

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
    <section id="home" className="min-vh-100">
      <section className="hero-p-top-100 hero-p-bottom-100 d-flex justify-content-center" id="wrap-movies">
        {movies.map((movie, index) => {
          return (
            <article className="wrap-image mb-3" key={index}>
              {movie.poster && <img src={`${process.env.AWS_FILE_PREFIX}${movie.poster.imageName}`} alt="" />}
            </article>
          );
        })}
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

      <section className="hero-bg-color-e7edef pt-5 pb-5 text-center">
        <h2>Bienvenue à {process.env.NAV_TITLE}</h2>
      </section>
    </section>
  );
};
export default Home;
