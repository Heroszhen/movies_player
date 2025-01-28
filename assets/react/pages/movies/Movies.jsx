import { useEffect, useRef } from "react";
import useMovieStore from "../../stores/movieStore";
import useUserStore from "../../stores/userStore";
import usePaginatorStore, { getPaginator, setRoute, setPage, setKeywords } from "../../stores/paginatorStore";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const Movies = (props) => {
    const { user } = useUserStore();
    const { movies, getMovies } = useMovieStore();
    const reactLocation = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        getPaginator(reactLocation.pathname);
        setRoute(reactLocation.pathname);
    }, []);
    const { page, itemsPerPage, total, keywords } = usePaginatorStore();

    useEffect(() => {
        if(user !== null) {
            getMovies(page, keywords, true);
        }
    }, [user, page]);

    const searchByKeywords = (e) => {
        const oldKeywords = keywords;
        if ((e.type === 'keyup' && e.keyCode === 13) || 
            (e.type === 'change' && !e.nativeEvent.data) ||
            e.type === 'click'
        ) {
            const newKeywords = searchRef.current.value;
            setKeywords(newKeywords);
            if (oldKeywords !== newKeywords && page === 1)getMovies(page, newKeywords, true);
            else setPage(1);
        }
    }

    return (
        <section id="movies" className="min-vh-100">
            <div className="container pt-5 pb-5">
                <div className="row">
                    <div className="col-12 mb-3">
                        <div className="input-group input-group-sm mb-3">
                            <input type="search" className="form-control" aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-sm" id="search" name="name" 
                                defaultValue={keywords}
                                ref={searchRef}
                                onChange={(e)=>searchByKeywords(e)}
                                onKeyUp={(e)=>searchByKeywords(e)}
                            />
                            <span className="input-group-text hero-cursor-pointer" onClick={searchByKeywords}>
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
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
                                <div 
                                    className="col-12 col-md-4 col-lg-3 wrap-video mb-5 hero-cursor-pointer" 
                                    key={index}
                                    onClick={()=>navigate(`/video/${movie.id}`)}
                                >
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