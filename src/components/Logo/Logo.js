import React from 'react';
import burgerLogo from '../../assets/images/logo2..png'
import classes from './Logo.css';

const logo=(props)=>(
    <div className={classes.Logo} style={{height:props.height}}>
        <img src={burgerLogo} alt="My Burger"/>
    </div>
);

export default logo;