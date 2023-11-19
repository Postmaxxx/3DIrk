import { NavLink } from "react-router-dom";

interface INavItem {
	level: string
	to: string
	end?: boolean
	tab?: boolean
	children:React.ReactNode
	k?: string
}

const NavItem: React.FC<INavItem> = ({level, to, end=false, tab=true, children, k}): JSX.Element => {
	return (
		<li className={level === '1' ? "nav-item" : 'submenu__item__point'} key={k}>
			<NavLink className={({ isActive }) => `nav-text_level_${level} ${isActive ? "selected" : ""}`} to={to} onClick={e => (e.target as HTMLElement).blur()} end={end} tabIndex={tab ? 0 : -1}>
				{children}
			</NavLink>
		</li>
	)
}

export default NavItem