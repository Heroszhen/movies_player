import { useState, useEffect } from 'react';
import { getActorsName } from '../../stores/actorStore';
import { NavLink } from "react-router-dom";
import useUserStore from '../../stores/userStore';
import ActorDetail from '../../components/actor_detail/ActorDetail';

const Actors = (props) => {
    const [actorIndex, setActorIndex] = useState(null);
    const [actors, setActors] = useState([]);
    const {user} = useUserStore();

    useEffect(() => {
        (async()=>{
            if (user !== null) {
                const response = await getActorsName();
                setActors(response);
            }
        })();
    }, [user]);

    const viewOneActor = (e, index) => {
        e.preventDefault();
        setActorIndex(index);
    }

    return (
        <>
            <section id="sectors" className="min-vh-100">
                {actorIndex !== null &&
                    <div className="text-end pt-2 pe-5 fs-4">
                        <i className="bi bi-x-circle hero-cursor-pointer" onClick={()=>setActorIndex(null)}></i>
                    </div>
                }

                <section id="list-actors" className={actorIndex === null ? '' : 'd-none'}>
                    <div className="container pt-5">
                        <div className="row">
                            <div className="col-12 mb-5">
                                <h2>Acteurs</h2>
                                {actors.length !== 0 && actors.length + ' acteurs'}
                            </div>
                            {
                                actors.map((item, index) => {
                                    return (
                                        <div className="col-md-6 col-lg-3 mb-4" key={index}>
                                            <div className="card border border-0">
                                                {item.currentPhoto &&  <img src={`${process.env.AWS_FILE_PREFIX}${item.currentPhoto.imageName}`} alt="" className="card-img-top" />}
                                                {!item.currentPhoto &&  <img src="/build/static/poster_not_found.png" alt="" className="card-img-top" />}
                                                <div className="card-body hero-bg-color-edf5f7 p-4">
                                                    <NavLink to={'/acteur/' + item.id} className="text-dark text-decoration-none fs-3" onClick={(e)=>viewOneActor(e, index)}>
                                                        {item.name}
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })   
                            }
                        </div>
                    </div>
                </section>
                {actorIndex !== null &&
                    <section id="list-actors" >
                        <ActorDetail id={actorIndex === null ? null : actors[actorIndex].id} />
                    </section>
                }
            </section>
        </>
    );
}
export default Actors;