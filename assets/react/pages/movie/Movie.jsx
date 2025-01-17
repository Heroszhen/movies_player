import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from "../../components/video_player/VideoPlayer";
import { getMovie } from "../../stores/movieStore";

const Movie = (props) => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        (async ()=>{
            const result = await getMovie(id);
            if(result.id)setMovie(result);
        })();
    }, [id]);

    return (
        <section id="movie" className="min-vh-100">
            <VideoPlayer video={movie} />
        </section>
    );
}
export default Movie;