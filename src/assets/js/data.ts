import { ICatalogBlock, IOrderBlock } from './../../interfaces';
import { IFibersBlock, IHeroBlock, INewsBlock, IPage } from "src/interfaces";
import imageOrder1 from 'src/assets/img/order/1.png'
import catalogPhoto1 from 'src/assets/img/catalog/1.png'


export const pagesList = [
    {
        name: {
            ru: "Главная",
            en: 'Home'
        },
        path: "/"
    },
    {
        name: {
            ru: "Материалы",
            en: 'Fibers'
        },
        path: "/fiber"
    },
    {
        name: {
            ru: "Каталог",
            en: 'Catalog'
        },
        path: "/catalog"
    },
    {
        name: {
            ru: "Заказать",
            en: 'Order'
        },
        path: "/order"
    },
] satisfies IPage[]




export const heroBlock = {
    header: {
        ru: 'Заголовок',
        en: 'Header'
    },
    text: {
        en: [
            {
                part: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
            },
            {
                part: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
            },
            {
                part: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
            },
            {
                part: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
            }
        ],
        ru: [
            {
                part: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
            },
            {
                part: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
            },
            {
                part: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
            },
            {
                part: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыпло'
            } 
        ]
    }
} satisfies IHeroBlock




export const newsBlock = { //NewsList
    header: {
        ru: 'Последние новости',
        en: 'Recent news'
    },
    text: {
        en: [
            {
                part: 'News adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
            },
        ],
        ru: [
            {
                part: 'Новости в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
            },
        ]
    }
}  satisfies INewsBlock






export const fibersBlock = {
    header: {
        ru: 'Материалы, используемые в печати',
        en: 'Materials using for 3D printing'
    },
    colors: {
        ru: 'Доступные цвета: ',
        en: 'Available colors: '
    },
    features: {
        ru: 'Характеристики: ',
        en: 'Features: '
    },
    text: {
        en: [
            {
                part: 'Fiber adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
            },
        ],
        ru: [
            {
                part: 'Материалы  в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
            },
        ]
    }
} satisfies IFibersBlock







export const orderBlock = {
    header: {
        en: 'Order 3D printing',
        ru: 'Заказать 3D печать'
    },
    subheader: {
        en: 'Make an order',
        ru: 'Отправить заявку'
    },
    name: {
        label: {
            en: 'Your name*',
            ru: 'Ваше имя*'
        },
    },
    phone: {
        label: {
            en: 'Your phone',
            ru: 'Ваш телефон'
        },
    },
    email: {
        label: {
            en: 'Your email*',
            ru: 'Ваша почта*'
        },
    },
    message: {
        label: {
            en: 'Information about the order (at least 10 symbols)*',
            ru: 'Информация о заказе (минимум 10 символов)*'
        },
    },
    files: {
        label: {
            en: 'Attach files',
            ru: 'Прикрепить файлы'
        }, 
        listLabel: {
            en: 'Attached files',
            ru: 'Прикрепленные файлы'
        },
        link: {
            en: 'Add files',
            ru: 'Выберите файлы'
        },
        linkRest: {
            en: 'or drag it here',
            ru: 'для добавления или перетащите их сюда'
        },
    },
    qrcode: imageOrder1,
    text: {
        en: [
            {
                part: 'Lofdgdf fdjg df djkfh kdfh dsfkjdfks dksf hgksdfghkdjfs hdfk dfks df df  f dkjfghdkjfg   gdsk dfgkdfh gdfkj',
            },

        ],
        ru: [
            {
                part: 'Хотите заказать 3д печать? Пишите нам в телеграмме. Рассчитаем стоимость и сроки изготовления, а так же поможем с выбором материала. По завершению печати отправим фото или видео с готовыми изделиями.',
            },
        ],
    }
} satisfies IOrderBlock




export const catalogBlock = {
    header: {
        en: 'Our portfolio',
        ru: 'Галерея наших работ'
    },
    subheader: {
        en: 'Subheader',
        ru: 'Подзаголовок'	
    },
    text: {
        en: [
            {
                part: '1Lofdgdf fdjg df djkfh kdfh dsfkjdfks dksf hgksdfghkdjfs hdfk dfks df df  f dkjfghdkjfg   gdsk dfgkdfh gdfkj',
            },
            {
                part: '1Lofdgdf fdjg df djkfh kdfh dsfkjdfks dksf hgksdfghkdjfs hdfk dfks df df  f dkjfghdkjfg   gdsk dfgkdfh gdfkj',
            },
            {
                part: '1Telegram contact: fdsgdfg dfgkh dfj',
            },
            {
                part: '1Email for making an order: dfgdsf g@defsg.rt',
            },
        ],
        ru: [
            {
                part: '1Хотите заказать 3д печать? Пишите нам в телеграмме. Рассчитаем стоимость и сроки изготовления, а так же поможем с выбором материала. По завершению печати отправим фото или видео с готовыми изделиями.',
            },
            {
                part: '1Работаем как с физическими, так и с юридическими лицами',
            },
            {
                part: '1Переходите по ссылке:  https://t.me/n0mad_047',
            },
            {
                part: '1Так же вы можете связаться с нами по электронной почте: v.rx@yandex.ru',
            },
        ],
    },
    img: {
        url: catalogPhoto1,
        name: {
            ru: 'Фото каталога',
            en: 'Catalog image'
        }
    },
    headerGallery: {
        en: 'Наш каталог',
        ru: 'Catalog'	
    },
    priceGallery: {
        en: 'Price',
        ru: 'Цена'
    }
} satisfies ICatalogBlock

