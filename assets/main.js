import './bootstrap.js';

import { createRoot } from 'react-dom/client';
import App from './react/App.jsx';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)