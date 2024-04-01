import React from "react";

import { Link } from "react-router-dom";
import "./Menu.css";
/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  const openMenu = () => {
    const menu = document.querySelector(".dropdown");
    const hamburger = document.querySelector(".hamburger");
    menu.classList.toggle("menuOpen");
    hamburger.classList.toggle("hamburgerX");
  };


  return (
    <nav className="navbar navbar-dark align-items-start p-0">
      <div className="container-fluid d-flex flex-column p-0">
        <div className="hamburger" onClick={openMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="sidebar-brand-text mx-3">
            <span>Periodic Tables</span>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <div className="dropdown">
          <ul className="nav navbar-nav text-light" id="accordionSidebar">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard" onClick={openMenu}>
                <span className="oi oi-dashboard" />
                &nbsp;Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search" onClick={openMenu}>
                <span className="oi oi-magnifying-glass" />
                &nbsp;Search
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reservations/new" onClick={openMenu}>
                <span className="oi oi-plus" />
                &nbsp;New Reservation
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tables/new" onClick={openMenu}>
                <span className="oi oi-layers" />
                &nbsp;New Table
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;
