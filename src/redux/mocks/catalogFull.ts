import p1photo1 from 'src/assets/img/catalog/c1/p1/1.jpg'
import p1photo2 from 'src/assets/img/catalog/c1/p1/2.jpg'
import p1photo3 from 'src/assets/img/catalog/c1/p1/3.jpg'
import p1photo4 from 'src/assets/img/catalog/c1/p1/4.jpg'

import p4photo1 from 'src/assets/img/catalog/c1/p2/1.jpg'
import p4photo2 from 'src/assets/img/catalog/c1/p2/2.jpg'
import p4photo3 from 'src/assets/img/catalog/c1/p2/3.jpg'
import p4photo4 from 'src/assets/img/catalog/c1/p2/4.jpg'
import p4photo5 from 'src/assets/img/catalog/c1/p2/5.jpg'

import p2photo1 from 'src/assets/img/catalog/c2/p2/1.jpg'
import p2photo2 from 'src/assets/img/catalog/c2/p2/2.jpg'
import p2photo3 from 'src/assets/img/catalog/c2/p2/3.jpg'
import p2photo4 from 'src/assets/img/catalog/c2/p2/4.jpg'


const catalogFull = [
    {
        id: 'c1',
        name: {
            en: 'Auto',
            ru: 'Авто'
        },
        products: [
            {
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
                            en: 'Совместимость с родными колесами',
                            ru: 'Compatible with original wheels'
                        },
                        value: {
                            en: 'Full',
                            ru: 'Полная'
                        },
                    },
                ],
                mods: {
                    en: [
                        {
                            part: '10*10*10mm'
                        },
                        {
                            part: '20*20*20mm'
                        },
                    ],
                    ru: [
                        {
                            part: '10*10*10мм'
                        },
                        {
                            part: '20*20*20мм'
                        },
                    ]
                }
            },
            {
                id: 'p4',
                name: {
                    en: 'Auto phone holder',
                    ru: 'Держатель телефона в авто'
                },
                price: {
                    en: 'from 200r',
                    ru: 'От 200р'
                },
                text: {
                    en: [
                        {
                            part: 'All about product number 4'
                        },
                        {
                            part: 'fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum'
                        },
                    ],
                    ru: [
                        {
                            part: 'Вся информация о продукте номер 4'
                        },
                        {
                            part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлап а'
                        },
                    ]
                },
                imgs: [
                    {
                        url: p4photo1,
                        name: {
                            ru: 'Товар 4 фото 1',
                            en: 'Product 4 photo 1'
                        }
                    },
                    {
                        url: p4photo2,
                        name: {
                            ru: 'Товар 4 фото 2',
                            en: 'Product 4 photo 2'
                        }
                    },
                    {
                        url: p4photo3,
                        name: {
                            ru: 'Товар 4 фото 3',
                            en: 'Product 4 photo 3' 
                        }
                    },
                    {
                        url: p4photo4,
                        name: {
                            ru: 'Товар 4 фото 4',
                            en: 'Product 4 photo 4'
                        }
                    },
                    {
                        url: p4photo5,
                        name: {
                            ru: 'Товар 4 фото 5',
                            en: 'Product 4 photo 5'
                        }
                    },
                ],
                fibers: ["f2","f3"],
                features: [
                    {
                        name: {
                            en: 'Weight',
                            ru: 'Вес'
                        },
                        value: {
                            en: '0.1kg',
                            ru: '100гр.'
                        },
                    },
                    {
                        name: {
                            en: 'Delivery',
                            ru: 'Доставка'
                        },
                        value: {
                            en: 'Not available',
                            ru: 'Самовывоз'
                        },
                    },
                    {
                        name: {
                            en: 'Min items to order',
                            ru: 'Минимальная партия для заказа'
                        },
                        value: {
                            en: '3 item',
                            ru: '3 шт.'
                        },
                    },
                ],
                mods: {
                    en: [
                        {
                            part: 'for Audi'
                        },
                        {
                            part: 'for Mitsubishi'
                        },
                        {
                            part: 'for BMW'
                        },
                    ],
                    ru: [
                        {
                            part: 'для Audi'
                        },
                        {
                            part: 'для Mitsubishi'
                        },
                        {
                            part: 'для BMW'
                        },
                    ]
                }
            },
        ]
    },
    {
        id: 'c2',
        name: {
            en: 'Toys',
            ru: 'Игрушки'
        },
        products: [
            {
                id: 'p2',
                name: {
                    en: 'Airplane',
                    ru: 'Самолет'
                },
                price: {
                    en: 'from 900rub to 1500rub',
                    ru: 'От 900р до 1500р'
                },
                text: {
                    en: [
                        {
                            part: 'All about product number 2'
                        },
                        {
                            part: 'fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum'
                        },
                    ],
                    ru: [
                        {
                            part: 'Вся информация о продукте номер 2'
                        },
                        {
                            part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлап а'
                        },
                    ]
                },
                imgs: [
                    {
                        url: p2photo1,
                        name: {
                            ru: 'Товар 2 фото 1',
                            en: 'Product 2 photo 1'
                        }
                    },
                    {
                        url: p2photo2,
                        name: {
                            ru: 'Товар 2 фото 2',
                            en: 'Product 2 photo 2'
                        }
                    },
                    {
                        url: p2photo3,
                        name: {
                            ru: 'Товар 2 фото 3',
                            en: 'Product 2 photo 3' 
                        }
                    },
                    {
                        url: p2photo4,
                        name: {
                            ru: 'Товар 2 фото 4',
                            en: 'Product 2 photo 4'
                        }
                    },
                ],
                fibers: ["f1","f3"],
                features: [
                    {
                        name: {
                            en: 'Weight',
                            ru: 'Вес'
                        },
                        value: {
                            en: 'less than 100gr',
                            ru: 'менее 100гр.'
                        },
                    },
                    {
                        name: {
                            en: 'package contents',
                            ru: 'Комплектация'
                        },
                        value: {
                            en: 'No batteries',
                            ru: 'Без батареек'
                        },
                    },
                    {
                        name: {
                            en: 'Min items to order',
                            ru: 'Минимальная партия для заказа'
                        },
                        value: {
                            en: '2 item',
                            ru: '2 шт.'
                        },
                    },
                    {
                        name: {
                            en: 'Allowed for children',
                            ru: 'Разрешено для детей'
                        },
                        value: {
                            en: 'older than 10yo',
                            ru: 'с 10 лет'
                        },
                    },
                ],
                mods: {
                    en: [
                        {
                            part: 'with motor'
                        },
                        {
                            part: 'without motor'
                        },
                    ],
                    ru: [
                        {
                            part: 'С моторчиком'
                        },
                        {
                            part: 'Без моторчика'
                        },
                    ]
                }
            },
        ]
    }
]



export default catalogFull