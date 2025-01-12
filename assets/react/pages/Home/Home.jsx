import React, {useState, useEffect} from 'react';
import { getCounts, getLastThreeMovies } from '../../services/api';
import useUserStore from '../../stores/userStore';
import './Home.scss';

const Home = (props) => {
    const { user } = useUserStore()
    const [counts, setCounts] = useState(null);
    const [photos, setPhotos] = useState(null);

    useEffect(() => {
        if (user !== null) {
            getData();
        }
    }, [user]);

    const getData = async () => {
        getCounts()
        .then(response => response.json())
        .then(response => {
            if (response?.data)setCounts(response.data);
        });

        getLastThreeMovies()
        .then(response => response.json())
        .then(response => {
            console.log(response)
        });
    }

    return (
        <section id="home">
            <section className="pt-5 pb-5 hero-fs-30">

            </section>
            {counts !==null &&
                <section id="wrap-counts" className="text-white pt-5 pb-5 hero-fs-30">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 text-center text-center mb-3">
                                {counts.movies}<br/>
                                Films
                            </div> 
                            <div className="col-md-4 text-center text-center mb-3">
                                {counts.actors}<br/>
                                Acteurs
                            </div> 
                            <div className="col-md-4 text-center text-center">
                                {counts.users}<br/>
                                Utilisateurs
                            </div> 
                        </div>  
                    </div>
                </section>
            }
        </section>
    );
}
export default Home;