import { useRef } from 'react';
import './VideoPlayer.scss';
import parse from 'html-react-parser';
import moment from "moment";
import { useNavigate } from 'react-router-dom';


const VideoPlayer = (props) => {
    const navigate = useNavigate();
    const wrapVideoRef = useRef(null);

    const setFullScreen = () => {
        const video = wrapVideoRef.current.querySelector('iframe') ?? wrapVideoRef.current.querySelector('video');
        if (video) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) { // Firefox
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) { // Chrome, Safari, Opera
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { // IE/Edge
                video.msRequestFullscreen();
            }
        }
    }

    return (
        <section id="video-player" className="pb-5">
           <div className="wrap-video hero-bg-color-000000" data-type={props.video?.type.id} ref={wrapVideoRef}>
                {props.video !== null && [1, 5].includes(props.video.type.id) && parse(props.video.link)}
                {props.video !== null && props.video.type.id === 2 &&
                    <iframe src={props.video.link} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="unsafe-url" webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>
                }
                {props.video !== null && props.video.type.id === 3 && 
                    <video controls>
                        <source src={props.video.link} type="video/mp4" />
                    </video>
                }
                {props.video !== null && props.video.type.id === 4 && 
                    <div className="wrap-photo text-center hero-cursor-pointer" onClick={()=>window.open(props.video.link)}>
                        {props.video.poster && <img src={`${process.env.AWS_FILE_PREFIX}${props.video.poster.imageName}`} alt="" className="hero-width-700 mw-100" />}
                        {!props.video.poster && <img src="/build/static/poster_not_found.png" alt="" className="hero-width-400" />}
                    </div>
                }
           </div>
           {props.video !== null &&
                <section className="container pt-2">
                    <div className="row">
                        <div className="col-12 mb-1">
                            <div className="d-flex justify-content-end align-items-center">
                                <i className="bi bi-arrow-return-left hero-cursor-pointer fs-3 me-4" onClick={()=>navigate(-1)}></i>
                                <i className="bi bi-arrows-fullscreen hero-cursor-pointer fs-3 me-4" onClick={()=>setFullScreen()}></i>
                            </div>
                        </div>
                        <div className="col-12">
                            <h4 className="fw-bold">{props.video.title}</h4>
                            <div className="row mt-5">
                                <div className="col-md-8 mb-3">
                                    {props.video.poster && <img src={`${process.env.AWS_FILE_PREFIX}${props.video.poster.imageName}`} alt="" className="hero-width-500 mw-100" />}
                                    {props.video.description &&
                                        <div className="mt-5">
                                            {parse(props.video.description)}
                                        </div>
                                    }
                                </div>
                                <div className="col-md-4">
                                    <div className="wrap-actors border border-secondary-subtle p-4 mb-4">
                                        <h4 className="mb-4">Détails</h4>
                                        <div className="mb-2">
                                            <strong>Date de sortie : </strong>
                                            {props.video.releasedAt && moment(props.video.releasedAt).format('DD/MM/YYYY')}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Durée : </strong>
                                            {props.video.duration} min
                                        </div>
                                        <div className="mb-2">
                                            <strong>Date d'ajout : </strong>
                                            {props.video.createdAt && moment(props.video.createdAt).format('DD/MM/YYYY')}
                                        </div>
                                    </div>
                                    <div className="wrap-actors border border-secondary-subtle p-4">
                                        <h4 className="mb-4">Distributions</h4>
                                        {props.video?.actors &&
                                            <>
                                                {
                                                    props.video.actors.map((actor, index)=> {
                                                        return (
                                                            <div className="actor mb-3 d-flex align-items-center" key={index}>
                                                                <div className="d-flex justify-content-ceter align-items-center hero-width-60 me-2">
                                                                    {actor.currentPhoto && <img src={`${process.env.AWS_FILE_PREFIX}${actor.currentPhoto.imageName}`} alt="" />}
                                                                </div>
                                                                <div className="hero-cursor-pointer">{actor.name}</div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
           }
        </section>
    );
}
export default VideoPlayer;