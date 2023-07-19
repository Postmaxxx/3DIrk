import { IAction } from "../../interfaces"
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
    type: actionsListBase.SET_NAV_MOB_OPEN,
});
export const setNavCloseMob = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_MOB_CLOSE,
});
export const setNavToggleMob = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_MOB_TOGGLE,
});



export const setNavOpenDt = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_DT_OPEN,
});
export const setNavCloseDt = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_DT_CLOSE,
});
export const setNavToggleDt = <T>():IAction<T> => ({
    type: actionsListBase.SET_NAV_DT_TOGGLE,
});

