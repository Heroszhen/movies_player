import { useState, useEffect } from 'react';
import { getActorsName } from '../../stores/actorStore';
import { NavLink } from "react-router-dom";
import useUserStore from '../../stores/userStore';
import ActorDetail from '../../components/actor_detail/ActorDetail';

const Actors = (props) => {
    const [actorId, setActorId] = useState(null);
    const [actors, setActors] = useState([]);
    const {user} = useUserStore();
    const [keywords, setKeywords] = useState('');

    useEffect(() => {
        (async()=>{
            if (user !== null) {
                const response = await getActorsName();
                setActors(response);
            }
        })();
    }, [user]);

    const viewOneActor = (e, id) => {
        e.preventDefault();
        setActorId(id);
    }

    return (
        <>
            <section id="sectors" className="min-vh-100">
                {actorId !== null &&
                    <div className="text-end pt-2 pe-5 fs-4">
                        <i className="bi bi-x-circle hero-cursor-pointer" onClick={()=>setActorId(null)}></i>
                    </div>
                }

                <section id="list-actors" className={actorId === null ? '' : 'd-none'}>
                    <div className="container pt-5">
                        <div className="row">
                            <div className="col-12">
                                <h2>Acteurs</h2>
                            </div>
                            <div className="col-12 mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    {actors.filter((item) => item.name.toLowerCase().includes(keywords.toLowerCase())).length + ' acteurs'}
                                    <input type="search" className="form-control hero-width-200" id="search" name="name" 
                                        defaultValue={keywords}
                                        onChange={(e)=>setKeywords(e.target.value)}
                                    />
                                </div>
                            </div>
                            {
                                actors
                                    .filter((item) => item.name.toLowerCase().includes(keywords.toLowerCase()))
                                    .map((item, index) => {
                                        return (
                                            <div className="col-md-6 col-lg-3 mb-4" key={index}>
                                                <div className="card border border-0">
                                                    {item.currentPhoto &&  <img src={`${process.env.AWS_FILE_PREFIX}${item.currentPhoto.imageName}`} alt="" className="card-img-top" />}
                                                    {!item.currentPhoto &&  <img src="/build/static/poster_not_found.png" alt="" className="card-img-top" />}
                                                    <div className="card-body hero-bg-color-edf5f7 p-4">
                                                        <NavLink to={'/acteur/' + item.id} className="hero-color-212529 text-decoration-none fs-3 hover:hero-color-9352b3" onClick={(e)=>viewOneActor(e, item.id)}>
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
                {actorId !== null &&
                    <section>
                        <ActorDetail id={actorId} />
                    </section>
                }
            </section>
        </>
    );
}
export default Actors;