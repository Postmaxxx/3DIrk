import { IAction } from "src/interfaces"
import { actionsListBase } from './actionsList'



export const setLangEn = <T>(): IAction<T> => ({
    type: actionsListBase.SET_LANG_EN,
})

export const setLangRu = <T>(): IAction<T> => ({
    type: actionsListBase.SET_LANG_RU,
})





export const setThemeLight = <T>(): IAction<T> => ({
    type: actionsListBase.SET_THEME_LIGHT,
})

export const setThemeDark = <T>(): IAction<T> => ({
    type: actionsListBase.SET_THEME_DARK,
})

export const setThemeToggle = <T>(): IAction<T> => ({
    type: actionsListBase.SET_THEME_TOGGLE,
})




export const setNavOpenMob = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_OPEN_MOB,
});

export const setNavCloseMob = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_CLOSE_MOB,
});
/*
export const setNavToggleMob = <T>():IAction<T> => ({
    type: SET_NAV_TOGGLE_MOB,
});
*/


export const setNavOpenDt = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_OPEN_DT,
});

export const setNavCloseDt = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_CLOSE_DT,
});
/*
export const setNavToggleDt = <T>():IAction<T> => ({
    type: SET_NAV_TOGGLE_DT});
*/
