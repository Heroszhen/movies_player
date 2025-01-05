import './Banner.scss';
import useUserStore from '../../stores/userStore';
import Nav from '../nav/nav';

const Banner = (props) => {
    const { user } = useUserStore();
    
    return (
        <section id="banner">
            <Nav user={user} />
        </section>
    );
}
export default Banner;