import { useState, useEffect } from 'react';
import { getActorById } from '../../stores/actorStore';
import useMovieStore from '../../stores/movieStore';
import { getPaginator2Stores } from '../../stores/paginator2Store';

const ActorDetail = (props) => {
    const { getVideoByActor, movies } = useMovieStore();
    const [actor, setActor] = useState(null);
    const usePaginator2Store = getPaginator2Stores('actor_detail');
    const { resetPaginator, page } = usePaginator2Store();

    useEffect(() => {
        resetPaginator();
        (async()=>{
            const response = await getActorById(props.id);
            setActor(response);
        })();
    }, []);
   
    useEffect(() => {
        (async()=>{
            if (props.id !== null) {
                getVideoByActor(page, props.id);
            }
        })();
    }, [page]);

    return (
        <section id="actor-detail">
            <div className="container">
                <div className="row">
                    {actor && 
                        <>
                            <div className="col-md-4 mb-3">
                                {actor.currentPhoto && <img src={`${process.env.AWS_FILE_PREFIX}${actor.currentPhoto.imageName}`} alt="" className="hero-shadow-10-10-40-0-rgba(52,58,64,.25)" />}
                            </div>
                            <div className="col-md-5 mb-3">

                            </div>
                            <div className="col-md-3 mb-3">

                            </div>
                        </>
                    }
                </div>
            </div>
        </section>
    );
}
export default ActorDetail;