import { useState, useEffect } from 'react';
import { getActorById } from '../../stores/actorStore';
import useMovieStore from '../../stores/movieStore';
import usePaginatorStore, { getPaginator, setRoute, setPage } from '../../stores/paginatorStore';
import { useLocation } from "react-router-dom";

const ActorDetail = (props) => {
    const { getVideoByActor, emptyMovies, movies } = useMovieStore();
    const reactLocation = useLocation();
    const [actor, setActor] = useState(null);
    const { page, itemsPerPage, total, keywords, route } = usePaginatorStore();

    useEffect(() => {
        getPaginator(reactLocation.pathname);
        setRoute(reactLocation.pathname);
    }, []);
    
    useEffect(() => {
        (async()=>{
            if (props.id !== null && route === reactLocation.pathname) {
                getVideoByActor(page, props.id);
                const response = await getActorById(props.id);
                setActor(response);
            }
        })();
    }, [page, route]);

    return (
        <section id="actor-detail">
            {movies.length}
        </section>
    );
}
export default ActorDetail;