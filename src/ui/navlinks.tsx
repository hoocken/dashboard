'use client';

import Link from 'next/link';
import styles from './sidenav.module.css';
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    {name: 'Home', href: '/', icon: '/home-icon.svg'},
    {name: 'Digit Recognition', href:'/digit-recognition', icon: '/number-one-icon.svg'}
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
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
        </>
    );
}