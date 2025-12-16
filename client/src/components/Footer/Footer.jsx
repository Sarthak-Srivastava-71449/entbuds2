import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Footer.css';

/**
 * Social Media Links Configuration
 */
const SOCIAL_LINKS = {
  instagram: {
    url: 'https://www.instagram.com/saarthaksrivastavaa/',
    label: 'Instagram',
    icon: InstagramIcon,
  },
  pinterest: {
    url: 'https://pin.it/6ukx4mU',
    label: 'Pinterest',
    icon: PinterestIcon,
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/sarthak-srivastava-6a82aa250/',
    label: 'LinkedIn',
    icon: LinkedInIcon,
  },
};

/**
 * Footer component
 * Displays footer information and links
 */
const Footer = () => {
  return (
    <footer className="footer">
      {/* About Section */}
      <div style={{ textAlign: 'start' }}>
        <h3 style={{ color: 'white' }}>The world of entertainment is huge.</h3>
        <h3 style={{ color: 'white' }}>There will be a lot more coming</h3>
        <h3 style={{ color: 'white' }}>for you in future.</h3>
        <h3 style={{ color: 'white' }}>Till then...</h3>
        <h3 style={{ color: 'white' }}>Stay tuned!!</h3>
      </div>

      {/* Social Media Section */}
      <div className="contacts">
        <h3 style={{ color: 'white' }}>Connect with me</h3>
        <div className="icons">
          {Object.entries(SOCIAL_LINKS).map(([key, { url, label, icon: Icon }]) => (
            <div key={key}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                aria-label={`Visit ${label}`}
              >
                <Icon style={{ color: '#e53935' }} fontSize="medium" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Links Section */}
      <div style={{ textAlign: 'start' }}>
        <h3 style={{ color: 'white' }}>More</h3>
        <Link to="privacy" style={{ color: 'white', textDecoration: 'none' }}>
          <p>Privacy Policy</p>
        </Link>
        <Link to="terms" style={{ color: 'white', textDecoration: 'none' }}>
          <p>Terms and Conditions</p>
        </Link>
      </div>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
