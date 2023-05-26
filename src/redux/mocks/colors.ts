import { IColor } from "src/interfaces";

const mockColors = [
    {
        id:'c_black',
        name: {
            ru: 'Черный',
            en: 'Black'
        },
        value: '000000'
    },
    {
        id:'c_white',
        name: {
            ru: 'Белый',
            en: 'White'
        },
        value: 'FFFFFF'
    },
    {
        id:'c_transp',
        name: {
            ru: 'Прозрачный',
            en: 'Transparent'
        },
        value: 'transparent'
    },
    {
        id:'c_mixed',
        name: {
            ru: 'Разноцветный',
            en: 'Mixed'
        },
        value: 'mixed'
    },
    {
        id:'c_red',
        name: {
            ru: 'Красный',
            en: 'Red'
        },
        value: 'FF0000'
    },
    {
        id:'c_green',
        name: {
            ru: 'Зеленый',
            en: 'Green'
        },
        value: '00FF00'
    },
    {
        id:'c_blue',
        name: {
            ru: 'Синий',
            en: 'Blue'
        },
        value: '0000FF'
    },
    {
        id:'c_yellow',
        name: {
            ru: 'Желтый',
            en: 'Yellow'
        },
        value: 'FFFF00'
    },
    {
        id:'c_u',
        name: {
            ru: 'Фиолетовый',
            en: 'Violet'
        },
        value: 'FF00FF'
    },
] satisfies IColor[]

export default mockColors