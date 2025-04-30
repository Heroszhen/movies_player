import { useState, useEffect } from 'react';
import { getActorById } from '../../stores/actorStore';
import useMovieStore from '../../stores/movieStore';
import { getPaginator2Stores } from '../../stores/paginator2Store';
import parse from 'html-react-parser';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const ActorDetail = (props) => {
  const { getVideoByActor, movies } = useMovieStore();
  const [actor, setActor] = useState(null);
  const usePaginator2Store = getPaginator2Stores('actor_detail');
  const { resetPaginator, page } = usePaginator2Store();
  const [section, setSection] = useState(1);
  const { user } = useUserStore();

  useEffect(() => {
    resetPaginator();
    (async () => {
      if (user !== null) {
        const response = await getActorById(props.id);
        setActor(response);
      }
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      if (props.id !== null && user !== null) {
        getVideoByActor(page, props.id);
      }
    })();
  }, [user, page]);

  return (
    <section id="actor-detail">
      <div className="container">
        <div className="row">
          {actor && (
            <>
              <div className="col-md-4 mb-3">
                {actor.currentPhoto && (
                  <img
                    src={`${process.env.AWS_FILE_PREFIX}${actor.currentPhoto.imageName}`}
                    alt=""
                    className="hero-shadow-10-10-40-0-rgba(52,58,64,.25)"
                  />
                )}
              </div>
              <div className="col-md-8 mb-3 pt-5">
                <section className="mb-5 d-flex justify-content-center align-items-center">
                  <h5
                    className={
                      (section === 1 ? 'actived ' : '') +
                      'hero-cursor-pointer hero-color-d3d3d3 hover:hero-color-000000 actived:hero-color-000000 me-3'
                    }
                    onClick={() => setSection(1)}>
                    Biographie
                  </h5>
                  <h5
                    className={
                      (section === 2 ? 'actived ' : '') +
                      'hero-cursor-pointer hero-color-d3d3d3 hover:hero-color-000000 actived:hero-color-000000 ms-3'
                    }
                    onClick={() => setSection(2)}>
                    Filmographie
                  </h5>
                </section>
                {section === 1 && (
                  <section className="row">
                    <div className="col-md-8 mb-3 overflow-hidden">{actor.description && parse(actor.description)}</div>
                    <div className="col-md-4">
                      <div className="wrap-actors border border-secondary-subtle p-4 mb-4">
                        <div className="mb-2">
                          <strong>Nom : </strong>
                          {actor.name}
                        </div>
                        <div className="mb-2">
                          <strong>Naissance : </strong>
                          {actor.birthday && moment(actor.birthday).format('DD/MM/YYYY')}
                        </div>
                        <div className="mb-2">
                          <strong>Pays : </strong>
                          {actor.country}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
                {section === 2 && (
                  <section className="row">
                    {movies.map((movie, index) => {
                      return (
                        <div className="col-6 col-lg-4 mb-3" key={index}>
                          <div className="text-white hero-bg-color-343a40 rounded p-1">
                            {movie.poster && (
                              <img src={`${process.env.AWS_FILE_PREFIX}${movie.poster.imageName}`} alt="" />
                            )}
                            <div className="pt-2 pb-2 text-center">
                              <h5 className="mb-4">{movie.title}</h5>
                              <NavLink to={'/video/' + movie.id} className="btn btn-movify">
                                Regarder
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
export default ActorDetail;
