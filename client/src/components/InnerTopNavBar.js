import React, { Component } from 'react';
import logo from '../resources/penn_book_menu_icon.svg';

import { InnerTopNavItems } from './InnerTopNavItems'
import '../styles/TopNavBar.css'

class InnerTopNavBar extends Component {
    state = { clicked: false}
    render() {
        return (
            <nav className="NavBarItems">
                <div style={{transform: 'scale(0.75)'}}  className="size">
                <img src={logo} className="Navbar-icon" alt="logo" />
                </div>
                <h1 className="NavBar-logo" >PennBook</h1>
                <div className="Navbar-icon"></div>
                <ul className={'NavBar-menu'}>
                    {InnerTopNavItems.map((item, i) => {
                        return(
                            <li key={i}>
                                <a className={item.class} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        )

                    })}

                </ul>
            </nav>
        )
    }
}


export default InnerTopNavBar