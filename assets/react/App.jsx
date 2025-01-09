import React, {useState, useEffect} from 'react';
import './App.scss';
import RoutesWrapper from './routes/RoutesWrapper';
import useUserStore from './stores/userStore';
import { setLogin } from './stores/userStore';
import Banner from './components/banner/Banner';
import { Modal } from 'bootstrap';

function App() {
    const { user, login } = useUserStore();
    const [loginModal, setLoginModal] = useState(null);

    useEffect(() => {
        setLoginModal(new Modal('#loginModal', {
            keyboard: false
        }));
    }, []);

    useEffect(() => {
        if(login === true)loginModal.show();
    }, [login]);

    return (
        <>
            <Banner />
            <RoutesWrapper />

            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" onClick={()=>setLogin(false)}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header justify-content-between align-items-center">
                            <h1 className="modal-title fs-5" id="loginModalLabel">Connecte-toi</h1>
                            <div className="hero-cursor-pointer" data-bs-dismiss="modal" aria-label="Close">X</div>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default App