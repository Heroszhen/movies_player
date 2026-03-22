import { Link } from 'react-router-dom';

const Poster = (props) => {
  return (
    <>
      <Link to={`/video/${props.movie.id}`} className="">
        <div>
          {props.movie.poster && <img src={`${process.env.AWS_FILE_PREFIX}${props.movie.poster.imageName}`} />}
          {!props.movie.poster && <img src="/build/static/poster_not_found.png" />}
        </div>
        <div>{props.movie.title}</div>
        <div className="small text-secondary">{props.movie.duration} min</div>
      </Link>
    </>
  );
};
export default Poster;
