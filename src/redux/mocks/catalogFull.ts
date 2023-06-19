import canister_1_1 from '../../assets/img/catalog/car-parts/canister_1/canister_1.webp'
import canister_1_2 from '../../assets/img/catalog/car-parts/canister_1/canister_2.webp'
import canister_1_3 from '../../assets/img/catalog/car-parts/canister_1/canister_3.webp'
import canister_1_4 from '../../assets/img/catalog/car-parts/canister_1/canister_4.webp'
import canister_1_5 from '../../assets/img/catalog/car-parts/canister_1/canister_5.webp'


import { IProductBE } from 'src/interfaces'

const mockProducts = [
    {
        categoryId: 'auto',
        _id: 'canister_1',
        name: {
            en: 'Attachment for a canister',
            ru: 'Крепление для канистры'
        },
        price: {
            en: 'from 500 rub.',
            ru: 'От 500 р.'
        },
        text: {
            en: 'Designed for transportation of «extreme» type canisters.\nUpgraded model. Enhanced based on operational characteristics and customer feedback.',
            ru: 'Предназначено для перевозок канистр типа «экстрим».\nУлучшенная модель. Доработана с учетом особенностей эксплуатации и отзывов покупателей.'
        },
        imgs: [
            {
                url: canister_1_1,
                name: {
                    ru: 'Каждое изделие проходит полную сборку и проверку перед передачей заказчику',
                    en: 'Each product undergoes full assembly and inspection before delivery to the customer'
                }
            },
            {
                url: canister_1_2,
                name: {
                    ru: 'Качественная посадка крепежа для удобной эксплуатации',
                    en: 'Secure fastening for convenient operation'
                }
            },
            {
                url: canister_1_3,
                name: {
                    ru: 'Специальная текстура, показавшая максимальные эксплуатационные характеристики',
                    en: 'Special texture that has demonstrated maximum operational characteristics'
                }
            },
            {
                url: canister_1_4,
                name: {
                    ru: 'Полный комплект, включающий в себя все необходимое для комфортной эксплуатации',
                    en: 'Complete set that includes everything necessary for comfortable operation' 
                }
            },
            {
                url: canister_1_5,
                name: {
                    ru: 'Полное заполнение детали для максимальной надежности изделия',
                    en: 'Full filling of the part for maximum reliability of the product'
                }
            },
        ],
        fibers: ["f_PETg"],
        features: [
            {
                name: {
                    en: 'Weight',
                    ru: 'Вес'
                },
                value: {
                    en: '0.2kg',
                    ru: '200гр.'
                },
            },
            {
                name: {
                    en: 'Delivery',
                    ru: 'Доставка'
                },
                value: {
                    en: 'Available',
                    ru: 'Возможна'
                },
            },
            {
                name: {
                    en: 'Min items to order',
                    ru: 'Минимальная партия'
                },
                value: {
                    en: '1 item',
                    ru: '1 шт.'
                },
            },
            {
                name: {
                    en: 'Compatible with original part',
                    ru: 'Совместимость с оригинальным креплением',
                },
                value: {
                    en: 'Full',
                    ru: 'Полная',
                },
            },
        ],
        mods: [
            {
                en: 'The length of the bolt: 8cm.',
                ru: 'Длина болта: 8см.'
            },
            {
                en: 'The length of the bolt: 12cm.',
                ru: 'Длина болта: 12см.'
            },

        ]
    },
   

  
] satisfies IProductBE[]



export default mockProducts