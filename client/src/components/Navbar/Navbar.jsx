import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import cinebuds from './newLogo.png';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth0 } from "@auth0/auth0-react";
import genres from '../../config/genres';

const Navbar = () => {
    const [nottransparent, letstransp] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
    const dropdownRef = useRef(null);

    

    const transparentTransition = () => {
        if(window.scrollY > 140){
            letstransp(true);
        } else{
            letstransp(false) 
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", transparentTransition);
        return () => window.removeEventListener("scroll", transparentTransition)
    }, [])


    const handleDropdown = () => {
        setShowDropdown(!showDropdown); // toggle dropdown visibility
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [dropdownRef]);


  return (
    
        <nav className={`navbar ${nottransparent && "navbarblack"}`}>
            
                <div className='left'>
            <Link to="/"><img src={cinebuds} className='logo' alt='logo'></img></Link>
                        <div className='spans'>
            
                        <Link to="movies/toprated" style={{textDecoration: "none"}}><span id='top'>Top Rated</span></Link>
                        <span onClick={handleDropdown}>Categories</span>
                        {showDropdown && (
                                                                <div className="dropdown-content" ref={dropdownRef} >
                                                                        {Object.entries(genres)
                                                                            .filter(([slug]) => slug !== 'toprated')
                                                                            .map(([slug, info]) => (
                                                                                <Link key={slug} to={`movies/${slug}`} style={{textDecoration: 'none'}}>
                                                                                    <span>{info.title}</span>
                                                                                </Link>
                                                                            ))}
                                                                </div>
                                                        )}
                        <Link to="movies/search" style={{textDecoration: "none", color: "white"}}><span>Search</span></Link>
            {isAuthenticated && (<Link to="userList" style={{textDecoration: "none", color: "white"}}><span>My List</span></Link>)}
            <Link to="tvhome" style={{textDecoration: "none", color: "white"}}><span>TV Shows</span></Link>
            <Link to="booking" style={{textDecoration: "none", color: "white"}}><span>Book</span></Link>
            </div>
            </div>
            {isAuthenticated ? (
                <div className='right'>
                    <Button
                    variant='contained'
                    startIcon={<PersonIcon />}
                    style={{
                        background: "red",
                        marginTop: "0.5em",
                    }}
                    onClick={logout}>
                        Logout
                    </Button>
                </div>
            ) : (
             <div className='right'>
                <Button
                variant='contained'
                startIcon={<PersonIcon />}
                style={{
                    background: "red",
                    marginTop: "0.5em",
                }}
                onClick={loginWithRedirect}>
                    Login
                </Button>
             </div>   
            )}
            
        </nav>
      
    
  )
}

export default Navbar
