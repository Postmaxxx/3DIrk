import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../redux/actions/base";
import { AnyAction, Dispatch, bindActionCreators } from "redux";
import cloud from "./theme_day__cloud.svg";
import star from "./theme_nigth__star.svg";
import "./themeSwitcher.scss";
import { setThemeDark, setThemeLight, setThemeToggle }  from "../../redux/actions/base"
import { IBaseState, IFullState, TLang } from "../../interfaces";
import { useScrollHider } from "../../hooks/scrollHider";

const actionsList = {setThemeDark, setThemeLight, setThemeToggle}

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


interface IStateSwitcher {
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




interface IPropsState {
    lang: TLang
	mobOpened: boolean
}

interface IPropsActions {
	setState: {
		base: typeof actionsList
	}
}

interface IProps extends IPropsState, IPropsActions {}


const ThemeSwitcher: React.FC<IProps> = ({mobOpened, lang, setState}): JSX.Element => {

	const _themeSwitcherCont = useRef<HTMLDivElement>(null);
    const {add: addToHider, clear: clearHider} = useScrollHider()



	const dayLightSwitcher = (switcherProps: Partial<IStateSwitcher>) => {

		const stateSW__default: Partial<IStateSwitcher>  = {
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
		
		
		const stateSW: Partial<IStateSwitcher> = {
			_themeSwitcherContainer: _themeSwitcherCont.current as HTMLDivElement,
			_themeSwitcher: undefined,
			_themeSwitcherInput: undefined,
			width: stateSW__default.width,
			height: stateSW__default.height,
			circleSize: stateSW__default.circleSize,
			duration: stateSW__default.duration,
			theme: stateSW__default.theme,
			numberOfStars: stateSW__default.numberOfStars,
			starsBlinkingDuration: stateSW__default.starsBlinkingDuration, //default durations
			clouds: stateSW__default.clouds,
			starsBlinkingAnimation: stateSW__default.starsBlinkingAnimation,
			isChanging: false,
			nodeForTheme: stateSW__default.nodeForTheme,
			saveState: stateSW__default.saveState,
		};
		 
		
		const classSwitcher = (classRemove: string, classAdd: string, delay: number): Promise<void> => { //class +/- for _contentSwitcher using delay
			return new Promise((res) => {
				setTimeout((): void => {
					classRemove ? stateSW._contentSwitcher?.classList.remove(classRemove) : void 0;
					classAdd ? stateSW._contentSwitcher?.classList.add(classAdd) : void 0;
					res();
				}, delay);
			});
		};
		
		  
		const changeTheme = (newTheme: TTheme) => { //main switcher
			if (stateSW.isChanging) { return; }
			stateSW.saveState && localStorage.setItem(stateSW.saveState, stateSW.theme as TTheme);
			stateSW.isChanging = true;
			if (newTheme === "light") {
				setState.base.setThemeLight();
				stateSW.nodeForTheme?.classList.remove("dark");
				classSwitcher("", "theme_light_1", 0)
					.then(() => classSwitcher("theme_light_1", "theme_light_2", (stateSW.duration || 1)/ 4))
					.then(() => {classSwitcher("theme_light_2", "theme_light", 30); stateSW.isChanging = false;});
			} else {
				setState.base.setThemeDark();
				stateSW.nodeForTheme?.classList.add("dark");
				classSwitcher("theme_light", "theme_light_back_1", 0)
					.then(() => classSwitcher("theme_light_back_1", "theme_light_back_2", (stateSW.duration || 1) / 4))
					.then(() => {classSwitcher("theme_light_back_2", "", 30); stateSW.isChanging = false;});
			}
		};
		
		
		const createThemeSwitcherStyles:EmptyVoid = () => {
			if (!stateSW.width || !stateSW.circleSize || !stateSW.height || !stateSW.duration ) return
			const circlePosition: number = stateSW.width / 2 - stateSW.circleSize; 
		
			const styleEl: HTMLStyleElement = document.createElement("style");
			document.head.appendChild(styleEl);
			const styleThemeSwitcher: CSSStyleSheet = styleEl.sheet as CSSStyleSheet;
		
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher {
					width: ${stateSW.width}px;
					height: ${stateSW.height}px;
					border-radius: ${stateSW.height / 2}px;
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
					clip-path: circle(${stateSW.circleSize}px at ${circlePosition}px 50%);
					transition: ${stateSW.duration /4}ms cubic-bezier(0,1,0,1);
				}`);
		
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher > div.dark {
					transition: ${stateSW.duration /4}ms cubic-bezier(0,1,0,1);
					background-color: #002E6E;
				}`);
		
		
			//theme light_1
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_1 .light {
					transition: ${stateSW.duration / 4}ms cubic-bezier(1,0,1,0);
					clip-path: circle(${stateSW.width* 10}px at ${circlePosition - stateSW.width * 10 + stateSW.circleSize}px 50%);
				}`);
			   
		
			//theme light_2
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_2 .light {
					transition: ${stateSW.duration/4}ms cubic-bezier(1,0,1,0);
					clip-path: circle(${stateSW.width*10}px at ${circlePosition - stateSW.width * 10 + (stateSW.circleSize)}px 50%);
				}`);
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_2 .dark {
					transition: ${stateSW.duration/4}ms cubic-bezier(1,0,1,0);
					clip-path: circle(${stateSW.width*10}px at ${circlePosition + stateSW.width * 10 + stateSW.circleSize}px 50%);
				}`);
		
			
			//theme light
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light .light {
					transition: ${stateSW.duration/4}ms cubic-bezier(0,1,0,1);
					z-index: 900;
					clip-path: circle(${stateSW.width*10}px at ${stateSW.circleSize - stateSW.width * 9}px 50%);
				}`);
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light .dark {
					transition: ${stateSW.duration/4}ms cubic-bezier(0,1,0,1);
					z-index: 1000;
					clip-path: circle(${stateSW.circleSize}px at ${circlePosition + stateSW.circleSize * 2}px 50%);
				}`);
		
		
			//theme light_back_1
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_1 .light {
					transition: 0ms;
					z-index: 900;
					clip-path: circle(${stateSW.width*10}px at ${stateSW.circleSize - stateSW.width * 9}px 50%);
		
				}`);
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_1 .dark {
					transition: ${stateSW.duration/4}ms cubic-bezier(1,0,1,0);
					z-index: 1000;
					clip-path: circle(${stateSW.width * 10}px at ${circlePosition + stateSW.circleSize + stateSW.width * 10}px 50%);
				}`);
		
		
			//theme light_back_2
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_2 .light {
					transition: 0ms;
					z-index: 1000;
					clip-path: circle(${stateSW.width*10}px at ${circlePosition - stateSW.width * 10 + stateSW.circleSize}px 50%);
				}`);
				
			styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher.theme_light_back_2 .dark {
					transition: 0ms;
					z-index: 900;
					clip-path: circle(${stateSW.width * 10}px at ${circlePosition + stateSW.circleSize + stateSW.width * 10}px 50%);
				}`);
		
		
			// themes_dark__star blinks
			stateSW.starsBlinkingDuration?.forEach((duration, index) => {
				styleThemeSwitcher.insertRule(`
				.theme-switcher > .content-switcher .dark .theme_dark__star-${index} {
					animation: star-blink ${duration}s linear infinite;
				}`);
			});
		
		
			//star blinking animation
			styleThemeSwitcher.insertRule(`
				@keyframes star-blink {
					${stateSW.starsBlinkingAnimation}
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
			stateSW.clouds?.forEach((cloud, index) => {
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
			if (!stateSW.width || !stateSW.height || !stateSW.starsBlinkingDuration?.length) return

			const _label = document.createElement("LABEL");
			
			stateSW._themeSwitcherInput = document.createElement("INPUT");
			stateSW._themeSwitcherInput.setAttribute("type", "checkbox");
			stateSW._themeSwitcherInput.setAttribute("aria-label", "Change the site theme");
		
			stateSW._themeSwitcher = document.createElement("DIV");
			stateSW._themeSwitcher.classList.add("theme-switcher");
		
			_label.appendChild(stateSW._themeSwitcherInput);
			_label.appendChild(stateSW._themeSwitcher);
			
			stateSW._themeSwitcherContainer?.appendChild(_label);
			
			const _contentSwitcher = document.createElement("div");
			_contentSwitcher.classList.add("content-switcher");
			_contentSwitcher.classList.add(currentTheme !== "dark" ? "theme_light" : "");
			stateSW._themeSwitcher.appendChild(_contentSwitcher);
			const _dark = document.createElement("div");
			const _light = document.createElement("div");
			_dark.classList.add("dark");
			_light.classList.add("light");
			_contentSwitcher.appendChild(_dark);
			_contentSwitcher.appendChild(_light);
			stateSW._contentSwitcher = _contentSwitcher;
		};
		
		const createStars: EmptyVoid = () => {
			const _contentSwitcherDark = stateSW._themeSwitcher?.querySelector(".content-switcher .dark");
			new Array(stateSW.numberOfStars)
				.fill("")
				.map((): IStar => {
					let size: number = Math.floor(Math.random()*20 + 1);
					size = size > 13 ? Math.floor(size / 3) : size; //to create more small stars than big
					return {
						x: Math.floor(Math.random() * (stateSW.width as number)),
						y: Math.floor(Math.random() * (stateSW.height as number)),
						size: size,
						blinkDuration:  Math.floor(Math.random() * (stateSW.starsBlinkingDuration?.length as number)) //different duration of blinking
					};
				})
				.forEach((star: IStar) => {
					const _star = document.createElement("img");
					_star.classList.add(`theme_dark__star-${star.blinkDuration}`);
					_star.alt = '';
					_star.style.position = "absolute";
					_star.style.left = `${star.x}px`;
					_star.style.top = `${star.y}px`;
					_star.style.width = `${star.size}px`;
					_star.style.aspectRatio = "1";
					_star.src = String(stateSW.star);
					_contentSwitcherDark?.appendChild(_star);
				});
		};
		
		
		const createClouds: EmptyVoid = () => {
			if (stateSW._themeSwitcher) {
				const _contentSwitcherLight = stateSW._themeSwitcher.querySelector(".content-switcher .light");
				if (!stateSW.clouds) return
				const listOfClouds: string[] = new Array(Math.ceil((stateSW.width as number) / (stateSW.clouds[stateSW.clouds.length - 1].width + stateSW.clouds[stateSW.clouds.length - 1].gap) + 2)).fill(""); //list of clouds in a cloud-raw, depends on the cloud size and gap between clouds + some reserve
				stateSW.clouds?.forEach((cloud, index: number) => {
					const _clouds = document.createElement("div");
					_clouds.classList.add(`clouds-${index}`);
					_contentSwitcherLight?.appendChild(_clouds);
			
					listOfClouds.forEach((): void => {
						const _cloud = document.createElement("img");
						_cloud.classList.add("cloud");
						_cloud.alt = '';
						_cloud.src = String(stateSW.cloud);
						_clouds.appendChild(_cloud);
					});
				});
			}
		};
	
	
		const setNewTheme = () => {
			stateSW.theme = stateSW.theme === "light" ? "dark" : "light";
			changeTheme(stateSW.theme);
		};
		
		
		const createThemeSwitcher = () => {
			stateSW._themeSwitcherContainer = switcherProps.themeSwitcherContainer;
			stateSW.star = switcherProps.star;
			stateSW.cloud = switcherProps.cloud;
			stateSW.nodeForTheme = switcherProps.nodeForTheme ? switcherProps.nodeForTheme : stateSW__default.nodeForTheme;
			stateSW.width = switcherProps.width ? switcherProps.width : stateSW__default.width;
			stateSW.height = switcherProps.height ? switcherProps.height : stateSW__default.height;
			stateSW.circleSize = switcherProps.circleSize ? switcherProps.circleSize : stateSW__default.circleSize;
			stateSW.duration = switcherProps.duration ? switcherProps.duration : stateSW__default.duration;
			stateSW.theme = switcherProps.theme ? switcherProps.theme : stateSW__default.theme;
			stateSW.numberOfStars = switcherProps.numberOfStars ? switcherProps.numberOfStars : stateSW__default.numberOfStars;
			stateSW.starsBlinkingDuration = switcherProps.starsBlinkingDuration ? switcherProps.starsBlinkingDuration : stateSW__default.starsBlinkingDuration;
			stateSW.clouds = switcherProps.clouds ? switcherProps.clouds : stateSW__default.clouds;
			stateSW.starsBlinkingAnimation = switcherProps.starsBlinkingAnimation ? switcherProps.starsBlinkingAnimation : stateSW__default.starsBlinkingAnimation;
			stateSW.saveState = switcherProps.saveState ? switcherProps.saveState : stateSW__default.saveState;
			new Promise<void>((res) => {
				createThemeSwitcherHtml("light");
				createThemeSwitcherStyles();
				createStars();
				createClouds();
				res();
			})
				.then(() => {
					if (stateSW.theme == "dark") {
						changeTheme("dark");
					}
					stateSW._themeSwitcherInput?.addEventListener("change", setNewTheme);
				});
		};
	
		const destroyThemeSwitcher = () => {
			stateSW._themeSwitcherInput?.removeEventListener("change", setNewTheme);
			while (stateSW._themeSwitcherContainer?.firstChild) {
				stateSW._themeSwitcherContainer.removeChild(stateSW._themeSwitcherContainer.firstChild);
			  }
		};
	
		return {
			create: createThemeSwitcher,
			destroy: destroyThemeSwitcher,
			changeTo: (theme: TTheme) => {
				stateSW.theme = theme;
				changeTheme(theme);
			},
			change: setNewTheme
		};
		
	};
	

	useEffect(() => {
		if (!_themeSwitcherCont.current) return
		localStorage.getItem("theme") as TTheme === 'dark' ? setState.base.setThemeDark() : setState.base.setThemeLight()
		const themeProps: Partial<IStateSwitcher> = { 
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
        

		addToHider(_themeSwitcherCont.current, 50)
		return () => clearHider()
	},[]);


	useEffect(() => {
		mobOpened ? _themeSwitcherCont.current?.classList.remove('hide') : _themeSwitcherCont.current?.classList.add('hide')
	}, [mobOpened])
	
	return (
		<div className='theme-switcher__container' ref={_themeSwitcherCont}></div>
	);
};


const mapStateToProps = (state: IFullState): IPropsState => ({
	mobOpened: state.base.mobOpened,
	lang: state.base.lang
})
  
  
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		base: bindActionCreators(actionsList, dispatch)
	}
})
  
  
export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher)

