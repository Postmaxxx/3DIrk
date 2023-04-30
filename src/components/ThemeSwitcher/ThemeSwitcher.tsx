import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { AnyAction, Dispatch, bindActionCreators } from "redux";
import cloud from "./theme_day__cloud.svg";
import star from "./theme_nigth__star.svg";
import "./themeSwitcher.scss";

type EmptyVoid = () => void
type TTheme = 'dark' | 'light'

type ICloud = {
    width: number
    gap: number
    top: number
    speed: number
    opacity: number
}

interface IStar {
    x: number
    y: number
    size: number
    blinkDuration:  number
}

interface IThemeSwitcher {
    theme: TTheme
	setState: typeof actions
}


interface IState {
	_themeSwitcherContainer: HTMLDivElement
	_themeSwitcher: HTMLElement,
	_themeSwitcherInput: HTMLElement,
	width: number
	height: number
	circleSize: number
	duration: number
	theme: TTheme
	numberOfStars: number
	starsBlinkingDuration: number[]
	clouds: ICloud[]
	starsBlinkingAnimation: string
	isChanging: boolean
	nodeForTheme: HTMLBodyElement
	saveState: string
	_contentSwitcher: HTMLDivElement
	star: string
    cloud: string
    themeSwitcher?: string
    themeSwitcherContainer: HTMLDivElement
}



const ThemeSwitcher: React.FC<IThemeSwitcher> = (props): JSX.Element => {

	const _themeSwitcherCont = useRef<HTMLDivElement>(null);

	const dayLightSwitcher = (switcherProps: any) => {

		const state__default: Partial<IState>  = {
			width: 70,
			height: 40,
			circleSize: 14,
			duration: 2000,
			theme: "light",
			numberOfStars: 30,
			nodeForTheme: document.querySelector("body") || undefined,
			saveState: "",
			starsBlinkingDuration: [0.9, 1.2, 1.4, 1.6, 1.8, 2.1], //default durations
			starsBlinkingAnimation: `
				0% { opacity: .2 }
				50% { opacity: .8 }
				100% { opacity: .2 }`,
			clouds: [ //default styles for clouds
				{
					width: 30, //px
					gap: 15, //px
					top: 0, //in percent of height
					speed: 7, //sec for 1 cycle, less -> faster
					opacity: 1, //transparent for line
				},
				{
					width: 25,
					gap: 20,
					top: 25,
					speed: 4,
					opacity: 0.85,
				},
				{
					width: 20,
					gap: 20,
					top: 40,
					speed: 5,
					opacity: 0.7,
				},
			]
		};
		
		
		const state: Partial<IState> = {
			_themeSwitcherContainer: _themeSwitcherCont.current as HTMLDivElement,
			_themeSwitcher: undefined,
			_themeSwitcherInput: undefined,
			width: state__default.width,
			height: state__default.height,
			circleSize: state__default.circleSize,
			duration: state__default.duration,
			theme: state__default.theme,
			numberOfStars: state__default.numberOfStars,
			starsBlinkingDuration: state__default.starsBlinkingDuration, //default durations
			clouds: state__default.clouds,
			starsBlinkingAnimation: state__default.starsBlinkingAnimation,
			isChanging: false,
			nodeForTheme: state__default.nodeForTheme,
			saveState: state__default.saveState,
		};
		 
		
		const classSwitcher = (classRemove: string, classAdd: string, delay: number): Promise<void> => { //class +/- for _contentSwitcher using delay
			return new Promise((res) => {
				setTimeout((): void => {
					classRemove ? state._contentSwitcher?.classList.remove(classRemove) : void 0;
					classAdd ? state._contentSwitcher?.classList.add(classAdd) : void 0;
					res();
				}, delay);
			});
		};
		
		  
		const changeTheme = (newTheme: TTheme) => { //main switcher
			if (state.isChanging) { return; }
			state.saveState && localStorage.setItem(state.saveState, state.theme as TTheme);
			state.isChanging = true;
			if (newTheme === "light") {
				props.setState.setThemeLight();
				state.nodeForTheme?.classList.remove("dark");
				classSwitcher("", "theme_light_1", 0)
					.then(() => classSwitcher("theme_light_1", "theme_light_2", (state.duration || 1)/ 4))
					.then(() => {classSwitcher("theme_light_2", "theme_light", 30); state.isChanging = false;});
			} else {
				props.setState.setThemeDark();
				state.nodeForTheme?.classList.add("dark");
				classSwitcher("theme_light", "theme_light_back_1", 0)
					.then(() => classSwitcher("theme_light_back_1", "theme_light_back_2", (state.duration || 1) / 4))
					.then(() => {classSwitcher("theme_light_back_2", "", 30); state.isChanging = false;});
			}
		};
		
		
		const createThemeSwitcherStyles:EmptyVoid = () => {
			if (!state.width || !state.circleSize || !state.height || !state.duration ) return
			const circlePosition: number = state.width / 2 - state.circleSize; 
		
			const styleEl: HTMLStyleElement = document.createElement("style");
			document.head.appendChild(styleEl);
			const styleThemeSwitcher: CSSStyleSheet = styleEl.sheet as CSSStyleSheet;
		
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher {
					width: ${state.width}px;
					height: ${state.height}px;
					border-radius: ${state.height / 2}px;
					position: relative;
					overflow: hidden;
					cursor: pointer;
					-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
				}`);
		
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher > div {
					position: absolute;
					height: 100%;
					width: 100%;
				}`);
		
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher > div.light {
					background-color: rgb(100 181 245);
					clip-path: circle(${state.circleSize}px at ${circlePosition}px 50%);
					transition: ${state.duration /4}ms cubic-bezier(0,1,0,1);
				}`);
		
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher > div.dark {
					transition: ${state.duration /4}ms cubic-bezier(0,1,0,1);
					background-color: #002E6E;
				}`);
		
		
			//theme light_1
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_1 .light {
					transition: ${state.duration / 4}ms cubic-bezier(1,0,1,0);
					clip-path: circle(${state.width* 10}px at ${circlePosition - state.width * 10 + state.circleSize}px 50%);
				}`);
			   
		
			//theme light_2
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_2 .light {
					transition: ${state.duration/4}ms cubic-bezier(1,0,1,0);
					clip-path: circle(${state.width*10}px at ${circlePosition - state.width * 10 + (state.circleSize)}px 50%);
				}`);
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_2 .dark {
					transition: ${state.duration/4}ms cubic-bezier(1,0,1,0);
					clip-path: circle(${state.width*10}px at ${circlePosition + state.width * 10 + state.circleSize}px 50%);
				}`);
		
			
			//theme light
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light .light {
					transition: ${state.duration/4}ms cubic-bezier(0,1,0,1);
					z-index: 900;
					clip-path: circle(${state.width*10}px at ${state.circleSize - state.width * 9}px 50%);
				}`);
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light .dark {
					transition: ${state.duration/4}ms cubic-bezier(0,1,0,1);
					z-index: 1000;
					clip-path: circle(${state.circleSize}px at ${circlePosition + state.circleSize * 2}px 50%);
				}`);
		
		
			//theme light_back_1
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_1 .light {
					transition: 0ms;
					z-index: 900;
					clip-path: circle(${state.width*10}px at ${state.circleSize - state.width * 9}px 50%);
		
				}`);
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_1 .dark {
					transition: ${state.duration/4}ms cubic-bezier(1,0,1,0);
					z-index: 1000;
					clip-path: circle(${state.width * 10}px at ${circlePosition + state.circleSize + state.width * 10}px 50%);
				}`);
		
		
			//theme light_back_2
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_2 .light {
					transition: 0ms;
					z-index: 1000;
					clip-path: circle(${state.width*10}px at ${circlePosition - state.width * 10 + state.circleSize}px 50%);
				}`);
				
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_2 .dark {
					transition: 0ms;
					z-index: 900;
					clip-path: circle(${state.width * 10}px at ${circlePosition + state.circleSize + state.width * 10}px 50%);
				}`);
		
		
			// themes_dark__star blinks
			state.starsBlinkingDuration?.forEach((duration, index) => {
				styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher .dark .theme_dark__star-${index} {
					animation: star-blink ${duration}s linear infinite;
				}`);
			});
		
		
			//star blinking animation
			styleThemeSwitcher.insertRule(`
				@keyframes star-blink {
					${state.starsBlinkingAnimation}
				}`);
		
				
			// Clouds base
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher .light > div {
					display: inline-block;
					height: auto;
					position: absolute;
					left: 0;
				}`);
		
			// all lines of clouds (line, cloud, animation)
			state.clouds?.forEach((cloud, index) => {
				styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher .light .clouds-${index} {
					width: ${(cloud.width * 6 + cloud.gap * 5)}px;
					top: ${cloud.top}%;
					animation: theme-clouds-${index}  linear infinite;
					animation-duration: ${cloud.speed}s;
				}`);
				styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher .light .clouds-${index} .cloud {
					width: ${cloud.width}px;
					margin-right: ${cloud.gap}px;
					opacity: ${cloud.opacity};
				}`); 
				styleThemeSwitcher.insertRule(`
				@keyframes theme-clouds-${index} {
					0% { transform: translateX(0); }
					100% { transform: translateX(${-(cloud.width + cloud.gap)}px); }
				}`);
			});    
		};
		
		
		
		const createThemeSwitcherHtml = (currentTheme: TTheme) => {
			if (!state.width || !state.height || !state.starsBlinkingDuration?.length) return

			const _label = document.createElement("LABEL");
			
			state._themeSwitcherInput = document.createElement("INPUT");
			state._themeSwitcherInput.setAttribute("type", "checkbox");
			state._themeSwitcherInput.setAttribute("aria-label", "Change the site theme");
		
			state._themeSwitcher = document.createElement("DIV");
			state._themeSwitcher.classList.add("theme-switcher");
		
			_label.appendChild(state._themeSwitcherInput);
			_label.appendChild(state._themeSwitcher);
			
			state._themeSwitcherContainer?.appendChild(_label);
			
			const _contentSwitcher = document.createElement("div");
			_contentSwitcher.classList.add("content-switcher");
			_contentSwitcher.classList.add(currentTheme !== "dark" ? "theme_light" : "");
			state._themeSwitcher.appendChild(_contentSwitcher);
			const _dark = document.createElement("div");
			const _light = document.createElement("div");
			_dark.classList.add("dark");
			_light.classList.add("light");
			_contentSwitcher.appendChild(_dark);
			_contentSwitcher.appendChild(_light);
			state._contentSwitcher = _contentSwitcher;
		};
		
		const createStars: EmptyVoid = () => {
			const _contentSwitcherDark = state._themeSwitcher?.querySelector(".content-switcher .dark");
			new Array(state.numberOfStars)
				.fill("")
				.map((): IStar => {
					let size: number = Math.floor(Math.random()*20 + 1);
					size = size > 13 ? Math.floor(size / 3) : size; //to create more small stars than big
					return {
						x: Math.floor(Math.random() * (state.width as number)),
						y: Math.floor(Math.random() * (state.height as number)),
						size: size,
						blinkDuration:  Math.floor(Math.random() * (state.starsBlinkingDuration?.length as number)) //different duration of blinking
					};
				})
				.forEach((star: IStar) => {
					const _star = document.createElement("img");
					_star.classList.add(`theme_dark__star-${star.blinkDuration}`);
					_star.style.position = "absolute";
					_star.style.left = `${star.x}px`;
					_star.style.top = `${star.y}px`;
					_star.style.width = `${star.size}px`;
					_star.style.aspectRatio = "1";
					_star.src = String(state.star);
					_contentSwitcherDark?.appendChild(_star);
				});
		};
		
		
		const createClouds: EmptyVoid = () => {
			if (state._themeSwitcher) {
				const _contentSwitcherLight = state._themeSwitcher.querySelector(".content-switcher .light");
				if (!state.clouds) return
				const listOfClouds: string[] = new Array(Math.ceil((state.width as number) / (state.clouds[state.clouds.length - 1].width + state.clouds[state.clouds.length - 1].gap) + 2)).fill(""); //list of clouds in a cloud-raw, depends on the cloud size and gap between clouds + some reserve
				state.clouds?.forEach((cloud, index: number) => {
					const _clouds = document.createElement("div");
					_clouds.classList.add(`clouds-${index}`);
					_contentSwitcherLight?.appendChild(_clouds);
			
					listOfClouds.forEach((): void => {
						const _cloud = document.createElement("img");
						_cloud.classList.add("cloud");
						_cloud.src = String(state.cloud);
						_clouds.appendChild(_cloud);
					});
				});
			}
		};
	
	
		const setNewTheme = () => {
			state.theme = state.theme === "light" ? "dark" : "light";
			changeTheme(state.theme);
		};
		
		
		const createThemeSwitcher = () => {
			state._themeSwitcherContainer = switcherProps.themeSwitcherContainer;
			state.star = switcherProps.star;
			state.cloud = switcherProps.cloud;
			state.nodeForTheme = switcherProps.nodeForTheme ? switcherProps.nodeForTheme : state__default.nodeForTheme;
			state.width = switcherProps.width ? switcherProps.width : state__default.width;
			state.height = switcherProps.height ? switcherProps.height : state__default.height;
			state.circleSize = switcherProps.circleSize ? switcherProps.circleSize : state__default.circleSize;
			state.duration = switcherProps.duration ? switcherProps.duration : state__default.duration;
			state.theme = switcherProps.theme ? switcherProps.theme : state__default.theme;
			state.numberOfStars = switcherProps.numberOfStars ? switcherProps.numberOfStars : state__default.numberOfStars;
			state.starsBlinkingDuration = switcherProps.starsBlinkingDuration ? switcherProps.starsBlinkingDuration : state__default.starsBlinkingDuration;
			state.clouds = switcherProps.clouds ? switcherProps.clouds : state__default.clouds;
			state.starsBlinkingAnimation = switcherProps.starsBlinkingAnimation ? switcherProps.starsBlinkingAnimation : state__default.starsBlinkingAnimation;
			state.saveState = switcherProps.saveState ? switcherProps.saveState : state__default.saveState;
			new Promise<void>((res) => {
				createThemeSwitcherHtml("light");
				createThemeSwitcherStyles();
				createStars();
				createClouds();
				res();
			})
				.then(() => {
					if (state.theme == "dark") {
						changeTheme("dark");
					}
					state._themeSwitcherInput?.addEventListener("change", setNewTheme);
				});
		};
	
		const destroyThemeSwitcher = () => {
			state._themeSwitcherInput?.removeEventListener("change", setNewTheme);
			while (state._themeSwitcherContainer?.firstChild) {
				state._themeSwitcherContainer.removeChild(state._themeSwitcherContainer.firstChild);
			  }
		};
	
		return {
			create: createThemeSwitcher,
			destroy: destroyThemeSwitcher,
			changeTo: (theme: TTheme) => {
				state.theme = theme;
				changeTheme(theme);
			},
			change: setNewTheme
		};
		
	};
	

	useEffect((): void => {
		localStorage.getItem("theme") as TTheme === 'dark' ? props.setState.setThemeDark() : props.setState.setThemeLight()
		const themeProps: Partial<IState> = { 
			themeSwitcherContainer: _themeSwitcherCont.current as HTMLDivElement, 
			star: star,
			cloud: cloud, 
			width: _themeSwitcherCont.current?.offsetWidth, 
			height: _themeSwitcherCont.current?.offsetHeight, 
			circleSize: Math.round((_themeSwitcherCont.current?.offsetHeight as number) / 3), 
			duration: 2000, 
			theme: (localStorage.getItem("theme") as TTheme) || "light", 
			numberOfStars: 30,
			nodeForTheme: document.querySelector("body") || undefined, //node for adding class 'dark' / 'light'
			saveState: "theme",
		};		
		const themeSwitcher = dayLightSwitcher(themeProps);
		themeSwitcher.create();
	},[]);
	
	return (
		<div className='theme-switcher__container' ref={_themeSwitcherCont}></div>
	);
};


const mapStateToProps = (state: IState) => ({
    theme: state.theme
  })
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
    setState: bindActionCreators(actions, dispatch)
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher)

