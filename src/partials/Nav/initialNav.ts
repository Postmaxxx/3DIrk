import { IPageItem } from "src/interfaces";

export const pagesList = [
    {
        name: {
            ru: "главная",
            en: 'home'
        },
        path: "/",
        id: 'main_home',
    },
    {
        name: {
            ru: "Филаменты",
            en: 'Filaments'
        },
        path: "/fibers",
        id: 'main_fibers',
        subMenu : [
            {
                name: {
                    ru: "О ФИЛАМЕНТАХ",
                    en: 'ABOUT'
                },
                path: "/fibers",
                id: 'about',

            },
            {
                name: {
                    ru: "СРАВНЕНИЕ",
                    en: 'COMPARASING'
                },
                path: "/fibers/compare",
                id: 'compare',

            },
        ]
    },
    {
        name: {
            ru: "каталог",
            en: 'catalog'
        },
        path: "/catalog",
        id: 'catalog',
    },
   /* {
        name: {
            ru: "заказать",
            en: 'order',
        },
        path: "/order",
        id: 'order',
    },*/
    {
        name: {
            ru: "ВХОД",
            en: 'Login'
        },
        path: "/auth",
        id: 'main_auth',
        notLink: true,
        subMenu : [
            {
                name: {
                    ru: "ЗАКАЗАТЬ",
                    en: 'ORDER '
                },
                path: "/fibers",
                id: 'none',
                notLink: true
            },
            {
                name: {
                    ru: "МСТОРИЯ ЗАКАЗОВ",
                    en: 'ORDERS HISTORY'
                },
                path: "/fibers",
                id: 'none',
                notLink: true
            },
            {
                name: {
                    ru: "ВЫХОД",
                    en: 'LOGOT'
                },
                path: "/fibers",
                id: 'logout',
                notLink: true
            },
        ]
    },
] satisfies IPageItem[]