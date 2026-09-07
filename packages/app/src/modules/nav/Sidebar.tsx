import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarScrollWrapper,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import { NavContentBlueprint } from '@backstage/plugin-app-react';
import MenuIcon from '@material-ui/icons/Menu';
import LogoFull from '../../components/Root/LogoFull';
import LogoIcon from '../../components/Root/LogoIcon';
import styles from './SidebarLogo.module.css';

const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();

  return (
    <div id="sidebar-logo" className={styles.root}>
      <Link to="/" underline="none" className={styles.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const SidebarContent = NavContentBlueprint.make({
  params: {
    component: ({ navItems }) => {
      const nav = navItems.withComponent(item => (
        <SidebarItem icon={() => item.icon} to={item.href} text={item.title} />
      ));

      return (
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Menu" icon={<MenuIcon />}>
            {nav.take('page:catalog')}
            {nav.take('page:s3-viewer')}
            <SidebarDivider />
            <SidebarScrollWrapper>
              {nav.rest({ sortBy: 'title' })}
            </SidebarScrollWrapper>
          </SidebarGroup>
        </Sidebar>
      );
    },
  },
});
