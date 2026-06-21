import { NavLink, useLocation } from "react-router";
import styles from './navbar.module.css';
import { useState, useEffect } from "react";

import lensB from '../assets/lens_iconB.svg';
import mapB from '../assets/map_iconB.svg';
import cameraB from '../assets/camera_iconB.svg';
import profileB from '../assets/profile_iconB.svg';
import lensW from '../assets/lens_iconW.svg';
import mapW from '../assets/map_iconW.svg';
import cameraW from '../assets/camera_iconW.svg';
import profileW from '../assets/profile_iconW.svg';

export default function Navbar() {
  const location = useLocation();
  const [lensHref, setLensHref] = useState("/lens/ann");
  const [profileHref, setProfileHref] = useState("/profile/ona");

  useEffect(() => {
    function updateHrefs() {
      const lens = localStorage.getItem('selectedLens') || 'ann';
      setLensHref(`/lens/${lens}`);
  
      const userType = localStorage.getItem('userType');
      setProfileHref(userType === 'visitor' ? '/profile/tom' : '/profile/ona');
    }
  
    updateHrefs();
    window.addEventListener('userTypeChanged', updateHrefs);
    return () => window.removeEventListener('userTypeChanged', updateHrefs);
  }, []);

  const items = [
    { to: lensHref,    label: "Lens",    iconB: lensB,    iconW: lensW,    match: "/lens" },
    { to: "/map",      label: "Map",     iconB: mapB,     iconW: mapW,     match: "/map" },
    { to: "/camera",   label: "Camera",  iconB: cameraB,  iconW: cameraW,  match: "/camera" },
    { to: profileHref, label: "Profile", iconB: profileB, iconW: profileW, match: "/profile" },
  ];

  return (
    <nav className={styles.bottomNav}>
      {items.map((item) => {
        const isActive = location.pathname.startsWith(item.match);
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          >
            <img src={isActive ? item.iconW : item.iconB} alt={item.label} className={styles.icon} />
            <p>{item.label}</p>
          </NavLink>
        );
      })}
    </nav>
  );
}