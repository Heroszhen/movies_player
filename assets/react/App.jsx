import React, {useState, useEffect} from 'react';

import RoutesWrapper from './RoutesWrapper.jsx';
import { Link } from "react-router-dom";

function App() {
    return (
        <>
            <RoutesWrapper />
            <Link to="/" className="route item">Accueil</Link>
            <Link to="/a-propos" className="route item">A propos</Link>
            <Link to="/contacte" className="route item">Contacte</Link>
        </>
    )
}
export default App