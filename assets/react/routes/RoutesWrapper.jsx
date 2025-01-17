import { Routes, Route } from "react-router-dom";
import LoginGuard from "./LoginGuard.jsx";
import AdminGuard from "./AdminGuard.jsx";

import Home from '../pages/home/Home.jsx';
import Contact from '../pages/contact/Contact.jsx';
import Movies from "../pages/movies/Movies.jsx";
import Movie from "../pages/movie/movie.jsx";

import AdminUser from "../pages/admin/user/User.jsx";


const RoutesWrapper = (props) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<LoginGuard />}>
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/videos" element={<Movies />} />
                    <Route path="/video/:id" element={<Movie />} />
                </Route>
                <Route element={<AdminGuard />}>
                    <Route path="/admin/utilisateurs" element={<AdminUser />} />
                </Route>
            </Routes>
        </>
    )
}
export default RoutesWrapper;