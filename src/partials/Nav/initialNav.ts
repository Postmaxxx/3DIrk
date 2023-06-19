import { IPageItem } from "src/interfaces";

export const pagesList = [
    {
        name: {
            ru: "главная",
            en: 'home'
        },
        path: "/",
        _id: 'main_home',
    },
    {
        name: {
            ru: "Филаменты",
            en: 'Filaments'
        },
        path: "/fibers",
        _id: 'main_fibers',
        subMenu : [
            {
                name: {
                    ru: "О ФИЛАМЕНТАХ",
                    en: 'ABOUT'
                },
                path: "/fibers",
                _id: 'about',

            },
            {
                name: {
                    ru: "СРАВНЕНИЕ",
                    en: 'COMPARASING'
                },
                path: "/fibers/compare",
                _id: 'compare',

            },
        ]
    },
    {
        name: {
            ru: "каталог",
            en: 'catalog'
        },
        path: "/catalog",
        _id: 'catalog',
    },
   /* {
        name: {
            ru: "заказать",
            en: 'order',
        },
        path: "/order",
        _id: 'order',
    },*/
    {
        name: {
            ru: "ВХОД",
            en: 'Login'
        },
        path: "/auth",
        _id: 'main_auth',
        notLink: true,
        subMenu : [
            {
                name: {
                    ru: "ЗАКАЗАТЬ",
                    en: 'ORDER '
                },
                path: "/fibers",
                _id: 'none',
                notLink: true
            },
            {
                name: {
                    ru: "МСТОРИЯ ЗАКАЗОВ",
                    en: 'ORDERS HISTORY'
                },
                path: "/fibers",
                _id: 'none',
                notLink: true
            },
            {
                name: {
                    ru: "ВЫХОД",
                    en: 'LOGOT'
                },
                path: "/fibers",
                _id: 'logout',
                notLink: true
            },
        ]
    },
] satisfies IPageItem[]