import { useParams } from 'react-router-dom';
import ActorDetail from "../../components/actor_detail/ActorDetail";

const Actor = (props) => {
    const { id } = useParams();

    return (
        <section id="actor" className="min-vh-100 pt-5">
            {id !== null &&
                <section>
                    <ActorDetail id={id} />
                </section>
            }
        </section>
    );
}
export default Actor;