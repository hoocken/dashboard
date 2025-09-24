import styles from './sidenav.module.css';
import Link from 'next/link';
import NavLinks from'@/ui/navlinks';

export default function SideNav() {
  return (
    <div className={styles.sidenav}>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        
      </div>
    </div>
  );
}
