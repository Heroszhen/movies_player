import './VideoPlayer.scss';
import parse from 'html-react-parser';
import moment from "moment";

const VideoPlayer = (props) => {

    return (
        <section id="video-player" className="pb-5">
           <div className="wrap-video hero-bg-color-000000" data-type={props.video?.type.id}>
                {props.video !== null && props.video.type.id === 1 && parse(props.video.link)}
                {props.video !== null && props.video.type.id === 2 &&
                    <iframe src={props.video.link} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="unsafe-url" allowFullScreen></iframe>
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
                {props.video !== null && props.video.type.id === 5 && parse(props.video.link)}
           </div>
           {props.video !== null &&
                <section className="container pt-4">
                    <div className="row">
                        <div className="col-12">
                            <h4 className="fw-bold">{props.video.title}</h4>
                            <small>
                                {props.video.releasedAt !== null && moment(props.video.releasedAt).format('DD/MM/YYYY')}
                            </small>
                            <div className="row mt-5">
                                <div className="col-md-8 mb-3">
                                    {props.video.poster && <img src={`${process.env.AWS_FILE_PREFIX}${props.video.poster.imageName}`} alt="" className="hero-width-400" />}
                                </div>
                                <div className="col-md-4">
                                    <div className="wrap-actors border border-secondary-subtle p-4">
                                        <h5>Distributions</h5>
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