import { ICatalogItem } from "src/interfaces"

const mockCategoriesList = [
    {
        id: 'auto',
        name: {
            en: 'Auto/moto',
            ru: 'Авто/мото'
        },
    },
    {
        id: 'c2',
        name: {
            en: 'Toys',
            ru: 'Игрушки'
        },
    },
    {
        id: 'c3',
        name: {
            en: 'Test',
            ru: 'Тест'
        },
    },
    {
        id: 'c4',
        name: {
            en: 'Decor',
            ru: 'Декор'
        },
    }
] satisfies ICatalogItem[]



export default mockCategoriesList