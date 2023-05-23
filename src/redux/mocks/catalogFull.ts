import p1photo1 from 'src/assets/img/catalog/c1/p1/1.jpg'
import p1photo2 from 'src/assets/img/catalog/c1/p1/2.jpg'
import p1photo3 from 'src/assets/img/catalog/c1/p1/3.jpg'
import p1photo4 from 'src/assets/img/catalog/c1/p1/4.jpg'

import p4photo1 from 'src/assets/img/catalog/c1/p4/1.jpg'
import p4photo2 from 'src/assets/img/catalog/c1/p4/2.jpg'
import p4photo3 from 'src/assets/img/catalog/c1/p4/3.jpg'
import p4photo4 from 'src/assets/img/catalog/c1/p4/4.jpg'
import p4photo5 from 'src/assets/img/catalog/c1/p4/5.jpg'

import p2photo1 from 'src/assets/img/catalog/c2/p2/1.jpg'
import p2photo2 from 'src/assets/img/catalog/c2/p2/2.jpg'
import p2photo3 from 'src/assets/img/catalog/c2/p2/3.jpg'
import p2photo4 from 'src/assets/img/catalog/c2/p2/4.jpg'
import { IProductBE } from 'src/interfaces'

const mockProducts = [
    {
        categoryId: 'c1',
        id: 'p1',
        name: {
            en: 'Wheel decor Pajero 5',
            ru: 'Колпак на колеса Pajero 5'
        },
        price: {
            en: 'from 400r',
            ru: 'От 400р'
        },
        text: {
            en: [
                {
                    part: 'All about product number1'
                },
                {
                    part: 'fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum'
                },
            ],
            ru: [
                {
                    part: 'Вся информация о продукте номер 1'
                },
                {
                    part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлап а'
                },
            ]
        },
        imgs: [
            {
                url: p1photo1,
                name: {
                    ru: 'Товар 1 фото 1',
                    en: 'Product 1 photo 1'
                }
            },
            {
                url: p1photo2,
                name: {
                    ru: 'Товар 1 фото 2',
                    en: 'Product 1 photo 2'
                }
            },
            {
                url: p1photo3,
                name: {
                    ru: 'Товар 1 фото 3',
                    en: 'Product 1 photo 3' 
                }
            },
            {
                url: p1photo4,
                name: {
                    ru: 'Товар 1 фото 4',
                    en: 'Product 1 photo 4'
                }
            },
        ],
        fibers: ["f1","f2","f3"],
        features: [
            {
                name: {
                    en: 'Weight',
                    ru: 'Вес'
                },
                value: {
                    en: '0.5kg',
                    ru: '500гр.'
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
                    ru: 'Минимальная партия для заказа'
                },
                value: {
                    en: '1 item',
                    ru: '1 шт.'
                },
            },
            {
                name: {
                    ru: 'Совместимость с родными колесами',
                    en: 'Compatible with original wheels'
                },
                value: {
                    en: 'Full',
                    ru: 'Полная'
                },
            },
        ],
        mods: [
            {
                en:  '10*10*10mm',
                ru: '10*10*10мм'
            },
            {
                en:  '20*20*20mm',
                ru: '20*20*20мм'
            },
        ]
    },
   

  
] satisfies IProductBE[]



export default mockProducts