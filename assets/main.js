import './bootstrap.js';

import 'uno.css'

import { createRoot } from 'react-dom/client';
import App from './react/App.jsx';
import { BrowserRouter } from "react-router-dom";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
