'use client';

import styles from './sidenav.module.css';
import React, { useState, useRef } from 'react';
import clsx from 'clsx';

import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const links = [
  {name: 'Home', href: '/', icon: '/home-icon.svg'},
  {name: 'Digit Recognition', href:'/digit-recognition', icon: '/number-one-icon.svg'}
];

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
      setIsOpen(!isOpen);
  }

  return (
    <>
      <HamburgerMenuButton toggle={handleClick} open={isOpen} />
      <HamburgerMenuCollapse open={isOpen}>
      </HamburgerMenuCollapse>
    </>
  );
}

function HamburgerMenuButton({ toggle, open }) {
  return (
    <button
      type="button"
      aria-expanded="false"
      aria-label="Toggle navigation"
      className={styles.toggler}
      onClick={toggle}
    >
      &#8801;
    </button>
  )
}

function HamburgerMenuCollapse({ open }) {
  const ref = useRef(null);
  const pathname = usePathname();

  return (
    <div className={`${styles.sidenav} ${open ? '' : styles.sidenavclosed}`}>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map(
          (link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                styles.navlinks,
                {
                  [styles.navlinksactive]: pathname === link.href,
                },
            )}
            >
              <Image src={link.icon} width={20} height={20} alt={link.name}/>
              <p>{link.name}</p>
            </Link>
          )
        )}
      </div>
    </div>
  )
}


