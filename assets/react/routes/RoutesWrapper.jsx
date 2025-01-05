import { Routes, Route } from "react-router-dom";

import Home from '../pages/home/Home.jsx';
import About from '../pages/about/About.jsx';
import Contact from '../pages/contact/Contact.jsx';

const RoutesWrapper = (props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </>
    )
}
export default RoutesWrapper;