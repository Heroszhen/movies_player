import { useEffect } from "react";
import useMovieStore from "../../stores/movieStore";
import useUserStore from "../../stores/userStore";

const Movies = (props) => {
    const { user } = useUserStore();
    const { movies, getMoviesPoster } = useMovieStore();

    useEffect(() => {
        if(user !== null)getMoviesPoster();
    }, [user]);

    return (
        <section id="movies" className="min-vh-100">
            <div className="container pt-5 pb-5">
                <div className="row">
                    <div className="col-12">

                    </div> 
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
                </div>          
            </div>
        </section>
    );
}
export default Movies;