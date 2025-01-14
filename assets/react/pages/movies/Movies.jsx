import { useEffect } from "react";
import useMovieStore from "../../stores/movieStore";
import useUserStore from "../../stores/userStore";
import usePaginatorStore, { getPaginator, setRoute, setPage, setKeywords } from "../../stores/paginatorStore";
import { useLocation } from "react-router-dom";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const Movies = (props) => {
    const { user } = useUserStore();
    const { movies, getMoviesPoster } = useMovieStore();
    const reactLocation = useLocation();

    useEffect(() => {
        getPaginator(reactLocation.pathname);
        setRoute(reactLocation.pathname);
    }, []);
    const { page, itemsPerPage, total, keywords } = usePaginatorStore();

    useEffect(() => {
        if(user !== null) {
            getMovies();
        }
    }, [user, page, keywords]);

    const getMovies = async () => {
        const query = keywords === '' ? null : `title=${keywords}`;
        getMoviesPoster(page, query);
    }

    return (
        <section id="movies" className="min-vh-100">
            <div className="container pt-5 pb-5">
                <div className="row">
                    <div className="col-12 mb-5">
                        
                    </div> 
                    {movies.length > 0 &&
                        <div className="col-12 mb-3">
                            <div className='wrap-paginator'>
                                <ResponsivePagination
                                    current={page}
                                    total={Math.ceil(total / itemsPerPage)}
                                    onPageChange={setPage}
                                    maxWidth={400}
                                />
                            </div>
                        </div>
                    }
                    {
                        movies.map((movie, index) => {
                            return (
                                <div className="col-12 col-md-4 col-lg-3 wrap-video mb-5 hero-cursor-pointer" key={index}>
                                    <div>
                                        {movie.poster && <img src={`${process.env.AWS_FILE_PREFIX}${movie.poster.imageName}`} />}
                                        {!movie.poster && <img src="/build/static/poster_not_found.png" />}
                                    </div>
                                    <div>{movie.title}</div>
                                    <div className="small text-secondary">{movie.duration} min</div>
                                </div>
                            );
                        })   
                    }
                    {movies.length > 0 &&
                        <div className="col-12">
                            <div className='wrap-paginator'>
                                <ResponsivePagination
                                    current={page}
                                    total={Math.ceil(total / itemsPerPage)}
                                    onPageChange={setPage}
                                    maxWidth={400}
                                />
                            </div>
                        </div>
                    }
                </div>          
            </div>
        </section>
    );
}
export default Movies;