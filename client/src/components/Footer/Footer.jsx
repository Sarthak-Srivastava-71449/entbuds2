import React from 'react';
import './Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link } from 'react-router-dom';

const Footer = () => {


    return (
        <div className='footer'>
            <div style={{ textAlign: "start" }}>
                <h3 style={{ color: "white" }}>
                    The world of entertainment is huge.
                </h3>
                <h3 style={{ color: "white" }}>
                    There will be a lot more coming
                </h3>
                <h3 style={{ color: "white" }}>
                    for you in future.
                </h3>
                <h3 style={{ color: "white" }}>
                    Till then...
                </h3>
                <h3 style={{ color: "white" }}>
                    Stay tuned!!
                </h3>
            </div>
            <div className='contacts'>
                <h3 style={{
                    color: "white"
                }}>Connect with me</h3>
                <div className='icons'>
                    <div>
                        <a href='https://www.instagram.com/saarthaksrivastavaa/' style={{ textDecoration: "none" }}>
                            <InstagramIcon style={{ color: "red" }} fontSize='medium' />

                        </a>
                    </div>
                    <div>
                        <a href='https://pin.it/6ukx4mU'>
                            <PinterestIcon style={{ color: "red" }} />
                        </a>
                    </div>
                    <div>
                        <a href='https://www.linkedin.com/in/sarthak-srivastava-6a82aa250/'>
                            <LinkedInIcon style={{ color: "red" }} />
                        </a>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: "start" }}>
                <h3 style={{ color: "white" }}>More</h3>
                <Link to="privacy" style={{ color: "white", textDecoration: "none" }}><p>Privacy Policy</p></Link>
                <Link to="terms" style={{ color: "white", textDecoration: "none" }}><p>Terms and Conditions</p></Link>
            </div>

        </div>
    )
}

export default Footer
