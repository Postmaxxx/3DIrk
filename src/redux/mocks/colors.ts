import { IColor } from "src/interfaces";

const mockColors = [
    {
        id:'c1',
        name: {
            ru: 'Белый',
            en: 'White'
        },
        value: 'FFFFFF'
    },
    {
        id:'c2',
        name: {
            ru: 'Разноцветный',
            en: 'Mixed'
        },
        value: 'mixed'
    },
    {
        id:'c3',
        name: {
            ru: 'Красный',
            en: 'Red'
        },
        value: 'FF0000'
    },
    {
        id:'c4',
        name: {
            ru: 'Зеленый',
            en: 'Green'
        },
        value: '00FF00'
    },
    {
        id:'c5',
        name: {
            ru: 'Синий',
            en: 'Blue'
        },
        value: '0000FF'
    },
    {
        id:'c6',
        name: {
            ru: 'Желтый',
            en: 'Yellow'
        },
        value: 'FFFF00'
    },
    {
        id:'c7',
        name: {
            ru: 'Фиолетовый',
            en: 'Violet'
        },
        value: 'FF00FF'
    },
] satisfies IColor[]

export default mockColors