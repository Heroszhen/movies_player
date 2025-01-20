import {useState, useEffect} from 'react';
import useMovieStore from '../../../stores/movieStore';
import usePaginatorStore, { getPaginator, setRoute, setPage, setKeywords } from '../../../stores/paginatorStore'; 
import { useLocation } from "react-router-dom";
import useUserStore from '../../../stores/userStore';

const AdminMovie = (props) => {
  const { movies, emptyMovies } = useMovieStore();
  const reactLocation = useLocation();
  const {user} = useUserStore();

  useEffect(() => {
    setRoute(reactLocation.pathname);
    emptyMovies()
  }, []);
  const { page, itemsPerPage, total, keywords } = usePaginatorStore();

  useEffect(() => {
    if (user !== null) {
        
    }
  }, [user, page, keywords]);


  return (
      <section id="admin-movie" className="vidoe">
        <div className="container-fluid pt-3">
          <div className="row">
            <div className="col-12 mb-3">
              <h3 className="d-flex align-items-center">
                  Vidéos
                  {/* <AddCircleIcon className="hero-cursor-pointer ms-2" onClick={()=>toggleForm(1)} /> */}
              </h3>
            </div>
            <div className="col-12 mb-3">

            </div>
          </div>
        </div>
      </section>
  );
}
export default AdminMovie;