import React from 'react';

const Footer = (props) => {
    
    return (
        <footer className="hero-bg-color-3e4555 pt-5 pb-5 text-white">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-3 mb-5">
                        <h4>{process.env.NAV_TITLE}</h4>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;