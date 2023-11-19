import { NavLink } from "react-router-dom"

interface INavItem {
	level: string
	to: string
	end?: boolean
	tab?: string
	children:React.ReactNode
	k?: string
	addClass?: string
	toggleFn: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
	currentTab?: string | null
}


const NavItemMob: React.FC<INavItem> = ({level, to, end=false, tab, children, k, addClass, currentTab, toggleFn}): JSX.Element => {
	return (
		<li className={`${level === '1' ? 'nav-item' : ''} ${level === '2' ? 'submenu__item' : ''} ${addClass ? addClass : ''}`} key={k}>
			<NavLink 
				className={({ isActive }) => `nav-text_level_${level} ${isActive ? "selected" : ""}`} 
				to={to} 
				onClick={(e) => toggleFn(e)}
				end={end} 
				tabIndex={(currentTab === tab || tab === 'always') ? 0 : -1}
			>
				{children}
			</NavLink>
		</li>
	)
}


export default NavItemMob