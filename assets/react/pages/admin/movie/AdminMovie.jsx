import {useState, useEffect} from 'react';
import useMovieStore from '../../../stores/movieStore';
import usePaginatorStore, { getPaginator, setRoute, setPage, setKeywords } from '../../../stores/paginatorStore'; 
import { useLocation } from "react-router-dom";
import useUserStore from '../../../stores/userStore';
import {
  Box,
  Button,
  TextField,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Input,
} from '@mui/material';
import { getActorsName } from '../../../stores/actorStore';
import moment from "moment";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PhotoIcon from '@mui/icons-material/Photo';

const AdminMovie = (props) => {
  const reactLocation = useLocation();
  const {user} = useUserStore();
  const [actors, setActors] = useState([]);

  useEffect(() => {
    setRoute(reactLocation.pathname);
    emptyMovies(),
    (async()=>{
      const results = await getActorsName();
      setActors(results);
    })();
  }, []);
  const { movies, emptyMovies, getMovies } = useMovieStore();
  const { page, itemsPerPage, total, keywords } = usePaginatorStore();

  useEffect(() => {
    if (user !== null) {
      getMovies(page, keywords);
    }
  }, [user, page]);

  const searchByKeywords = (e) => {
    const oldKeywords = keywords;
    if (e.type === 'keyup' && e.keyCode === 13) {
        setKeywords(e.target.value);
        if (oldKeywords !== keywords && page === 1)getMovies(page, keywords);
        else setPage(1);
    }
  }

  const handleChangePage = async (event, newPage) => {
    if(newPage !== page) {
        setPage(newPage);
    }
  };

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
              <TableContainer component={Paper} >
                <Table className="striped">
                  <TableHead sx={{ fontWeight: 'bold'}}>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Titre</TableCell>
                      <TableCell>Photo</TableCell>
                      <TableCell>Actors</TableCell>
                      <TableCell>Durée</TableCell>
                      <TableCell>Date de sortie</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date d'ajout</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      movies.map((movie, index)=>{
                        return (
                            <TableRow key={index} hover={true}>
                                <TableCell>{movie.id}</TableCell>
                                <TableCell>{movie.title}</TableCell>
                                <TableCell>
                                    {movie.poster &&  <img src={`${process.env.AWS_FILE_PREFIX}${movie.poster.imageName}`} alt="" className="hero-width-120" />}
                                </TableCell>
                                <TableCell>{movie.title}</TableCell>
                                <TableCell>{movie.duration}</TableCell>
                                <TableCell>
                                    {movie.releasedAt !== null && moment(movie.releasedAt).format('DD/MM/YYYY')}
                                </TableCell>
                                <TableCell>{movie.type.name}</TableCell>
                                <TableCell>
                                    {movie.createdAt !== null && moment(movie.createdAt).format('DD/MM/YYYY')}
                                </TableCell>
                                <TableCell>
                                    <PhotoIcon className="me-4 hero-cursor-pointer"/>
                                    <ModeEditIcon className="hero-cursor-pointer" />
                                </TableCell>
                            </TableRow>
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="col-12">
                <Pagination
                    count={Math.ceil(total / itemsPerPage)}
                    page={page}
                    color="secondary"
                    onChange={handleChangePage}
                />
            </div>
          </div>
        </div>
      </section>
  );
}
export default AdminMovie;