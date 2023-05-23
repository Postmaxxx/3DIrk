import { ICategoriesListItem } from "src/interfaces"

const mockCategoriesList = [
    {
        id: 'c1',
        name: {
            en: 'Auto',
            ru: 'Авто'
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
] satisfies ICategoriesListItem[]



export default mockCategoriesList