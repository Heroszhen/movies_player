import { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const Movie = (props) => {
    const { id } = useParams();

    useEffect(() => {
        console.log(id)
    }, [id]);


    return (
        <section id="movie" className="min-vh-100">
            contact
        </section>
    );
}
export default Movie;