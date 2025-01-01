import { Routes, Route } from "react-router-dom";

import Home from './pages/Home/Home.jsx';
import About from "./pages/about/About.jsx";
import Contact from "./pages/contact/Contact.jsx";

const RoutesWrapper = (props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/contacte" element={<Contact />} />
            </Routes>
        </>
    )
}
export default RoutesWrapper;