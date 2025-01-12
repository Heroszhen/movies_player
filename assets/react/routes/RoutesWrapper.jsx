import { Routes, Route } from "react-router-dom";
import LoginGuard from "./LoginGuard.jsx";

import Home from '../pages/home/Home.jsx';
import Contact from '../pages/contact/Contact.jsx';
import Movie from "../pages/movie/Movie.jsx";

const RoutesWrapper = (props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<LoginGuard />}>
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/videos" element={<Movie />} />
                </Route>
            </Routes>
        </>
    )
}
export default RoutesWrapper;