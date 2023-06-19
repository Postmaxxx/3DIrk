import { ICatalogItem } from "src/interfaces"

const mockCategoriesList = [
    {
        _id: 'auto',
        name: {
            en: 'Auto/moto',
            ru: 'Авто/мото'
        },
    },
    {
        _id: 'c2',
        name: {
            en: 'Toys',
            ru: 'Игрушки'
        },
    },
    {
        _id: 'c3',
        name: {
            en: 'Test',
            ru: 'Тест'
        },
    },
    {
        _id: 'c4',
        name: {
            en: 'Decor',
            ru: 'Декор'
        },
    }
] satisfies ICatalogItem[]



export default mockCategoriesList