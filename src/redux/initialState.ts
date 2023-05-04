import { TLangText } from './../interfaces';
import { IState } from '../interfaces'
import imageNews1 from '../assets/img/portfolio/1.png'
import imageNews2 from '../assets/img/portfolio/2.jpeg'
import imageNews3 from '../assets/img/portfolio/3.jpeg'
import imageNews4 from '../assets/img/portfolio/4.jpeg'
import imageNews5 from '../assets/img/portfolio/5.png'
import imageNews6 from '../assets/img/portfolio/6.png'


let initialState = {} as IState
const currentDate: Date = new Date;


initialState = {
    ...initialState,
    theme: 'light',
    lang: 'ru',
    pagesList: [
        {
            name: {
                ru: "Главная",
                en: 'Home'
            },
            path: "/"
        },
        /*{
            name: {
                ru: "Технологии",
                en: 'Technologies'
            },
            path: "/tech"
        },*/
        {
            name: {
                ru: "Материалы",
                en: 'Fibers'
            },
            path: "/fiber"
        },
        {
            name: {
                ru: "Портфолио",
                en: 'Portfolio'
            },
            path: "/portfolio"
        },
        {
            name: {
                ru: "Заказать",
                en: 'Order'
            },
            path: "/order"
        },
    ],
    components: {
        heroBlock: {// Hero
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
        },
        newsBlock: { //NewsList
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
            },
            news: [//------------------------NEWS----------------------------------
                {
                    header: {
                        ru: 'Новость 1',
                        en: 'News 1'
                    },
                    date: currentDate,
                    short: {
                        ru: 'Новость 1  авп вап авп авпаолва ва валыопрваолп ва авло ав вапрловаолп ав  апрапрап ап  па пар апр па',
                        en: 'News 1 dfg df dfdf df gdf dfdfghdfgkj dkdfk dfk hfd dfkjdfhg kdfjgkdfsj dfdf kfkfd dfkgkj kj kh '
                    },
                    text: {
                        en: [
                            {
                                part: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
                            },
                        ]
                    },
                    imgs: [
                        {
                            path: 'Image-1.jpg',
                            url: imageNews1,
                            alt: {
                                ru: 'Изображение 1',
                                en: 'Image 1'
                            }
                        },
                        {
                            path: 'Image-2.jpg',
                            url: imageNews2,
                            alt: {
                                ru: 'Изображение 2',
                                en: 'Image 2'
                            }
                        },
                    ],
                },
                {
                    header: {
                        ru: 'Новость 2',
                        en: 'News 2'
                    },
                    date: currentDate,
                    short: {
                        ru: 'Новость 2  авп вап авп авпаолва ва валыопрваолп ва авло ав вапрловаолп ав  апрапрап ап  па пар апр па',
                        en: 'News 2 dfg df dfdf df gdf dfdfghdfgkj dkdfk dfk hfd dfkjdfhg kdfjgkdfsj dfdf kfkfd dfkgkj kj kh '
                    },
                    text: {
                        en: [
                            {
                                part: 'Lorem gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'fgdh fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
                            },
                        ]
                    },
                    imgs: [
                        {
                            path: 'Image-2.jpg',
                            url: imageNews2,
                            alt: {
                                ru: 'Изображение 2',
                                en: 'Image 2'
                            }
                        },
                        {
                            path: 'Image-3.jpg',
                            url: imageNews3,
                            alt: {
                                ru: 'Изображение 3',
                                en: 'Image 3'
                            }
                        },
                    ],
                },
                {
                    header: {
                        ru: 'Новость 3',
                        en: 'News 3'
                    },
                    date: currentDate,
                    short: {
                        ru: 'Новость 3  авп вап авп авпаолва ва валыопрваолп ва авло ав вапрловаолп ав  апрапрап ап  па пар апр па',
                        en: 'News 3 dfg df dfdf df gdf dfdfghdfgkj dkdfk dfk hfd dfkjdfhg kdfjgkdfsj dfdf kfkfd dfkgkj kj kh '
                    },
                    text: {
                        en: [
                            {
                                part: 'Lorem gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'fgdh fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
                            },
                        ]
                    },
                    imgs: [
                        {
                            path: 'Image-2.jpg',
                            url: imageNews3,
                            alt: {
                                ru: 'Изображение 2',
                                en: 'Image 2'
                            }
                        },
                        {
                            path: 'Image-3.jpg',
                            url: imageNews4,
                            alt: {
                                ru: 'Изображение 3',
                                en: 'Image 3'
                            }
                        },
                    ],
                },
                {
                    header: {
                        ru: 'Новость 4',
                        en: 'News 4'
                    },
                    date: currentDate,
                    short: {
                        ru: 'Новость 4  авп вап авп авпаолва ва валыопрваолп ва авло ав вапрловаолп ав  апрапрап ап  па пар апр па',
                        en: 'News 4 dfg df dfdf df gdf dfdfghdfgkj dkdfk dfk hfd dfkjdfhg kdfjgkdfsj dfdf kfkfd dfkgkj kj kh '
                    },
                    text: {
                        en: [
                            {
                                part: 'Lorem gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'fgdh fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
                            },
                        ]
                    },
                    imgs: [
                        {
                            path: 'Image-4.jpg',
                            url: imageNews4,
                            alt: {
                                ru: 'Изображение 4',
                                en: 'Image 4'
                            }
                        },
                    ],
                },
                {
                    header: {
                        ru: 'Новость 5',
                        en: 'News 5'
                    },
                    date: currentDate,
                    short: {
                        ru: 'Новость 5  авп вап авп авпаолва ва валыопрваолп ва авло ав вапрловаолп ав  апрапрап ап  па пар апр па',
                        en: 'News 5 dfg df dfdf df gdf dfdfghdfgkj dkdfk dfk hfd dfkjdfhg kdfjgkdfsj dfdf kfkfd dfkgkj kj kh '
                    },
                    text: {
                        en: [
                            {
                                part: 'Lorem gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'fgdh fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
                            },
                        ]
                    },
                    imgs: [
                        {
                            path: 'Image-5.jpg',
                            url: imageNews5,
                            alt: {
                                ru: 'Изображение 5',
                                en: 'Image 5'
                            }
                        },
                        {
                            path: 'Image-6.jpg',
                            url: imageNews6,
                            alt: {
                                ru: 'Изображение 6',
                                en: 'Image 6'
                            }
                        },
                    ],
                },
                
            ]
        },
        fibersBlock: {//-------------------------FibersBlock------------
            header: {
                ru: 'Материалы, используемые в печати',
                en: 'Materials using for 3D printing'
            },
            dataLoading: {
                status: 'idle',
                message: '',
            },
            fibersList: [
                {
                    header: {
                        ru: 'Пластик 1',
                        en: 'Plastic 1'
                    },
                    text: {
                        en: [
                            {
                                part: 'Plastic 1 gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'fgh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлап а'
                            },
                        ]
                    },
                    proscons: {
                        pros: {
                            en: [
                                {
                                    part:'Good'
                                },
                                {
                                    part:'Better'
                                },
                                {
                                    part:'Awesome'
                                },
                            ],
                            ru: [
                                {
                                    part:'Хорошо'
                                },
                                {
                                    part:'Очень хорошо'
                                },
                                {
                                    part:'Прямо таки прекрасно, но не очень'
                                },
                            ],
                        },
                        cons: {
                            en: [
                                {
                                    part:'Bad'
                                },
                                {
                                    part:'Really bad'
                                },
                            ],
                            ru: [
                                {
                                    part:'Плохо'
                                },
                                {
                                    part:'Очень плохо'
                                },
                            ],
                        },
                    },
                    imgs: [
                        {
                            path: 'Image-1.jpg',
                            url: imageNews1,
                            alt: {
                                ru: 'Изображение 1',
                                en: 'Image 1'
                            }
                        },
                        {
                            path: 'Image-2.jpg',
                            url: imageNews2,
                            alt: {
                                ru: 'Изображение 2',
                                en: 'Image 2'
                            }
                        },
                        {
                            path: 'Image-3.jpg',
                            url: imageNews3,
                            alt: {
                                ru: 'Изображение 3',
                                en: 'Image 3'
                            }
                        },
                        {
                            path: 'Image-4.jpg',
                            url: imageNews4,
                            alt: {
                                ru: 'Изображение 4',
                                en: 'Image 4'
                            }
                        },
                        {
                            path: 'Image-5.jpg',
                            url: imageNews5,
                            alt: {
                                ru: 'Изображение 5',
                                en: 'Image 5'
                            }
                        },
                        {
                            path: 'Image-6.jpg',
                            url: imageNews6,
                            alt: {
                                ru: 'Изображение 6',
                                en: 'Image 6'
                            }
                        },
                    ] 
                },
                {
                    header: {
                        ru: 'ABS Пластик 21',
                        en: 'ABS 21'
                    },
                    text: {
                        en: [
                            {
                                part: 'Plastic 2 gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                            },
                            {
                                part: 'f gdsfgdfggh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum'
                            },
                        ],
                        ru: [
                            {
                                part: 'ВАП авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
                            },
                            {
                                part: 'ВАП вап ывап в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлап а'
                            },
                        ]
                    },
                    proscons: {
                        pros: {
                            en: [
                                {
                                    part:'Nice'
                                },
                                {
                                    part:'Cheap'
                                },
                            ],
                            ru: [
                                {
                                    part:'Хороший'
                                },
                                {
                                    part:'Дешман'
                                },
                            ],
                        },
                        cons: {
                            en: [
                                {
                                    part:'Bad'
                                },
                                {
                                    part:'Really bad'
                                },
                                {
                                    part:'Literally the piece of shit'
                                },
                            ],
                            ru: [
                                {
                                    part:'Плохо'
                                },
                                {
                                    part:'Очень плохо'
                                },
                                {
                                    part:'Прямо таки ай-ай-ай'
                                },
                            ],
                        },
                    },
                    imgs: [
                        {
                            path: 'Image-3.jpg',
                            url: imageNews3,
                            alt: {
                                ru: 'Изображение 3',
                                en: 'Image 3'
                            }
                        },
                        {
                            path: 'Image-5.jpg',
                            url: imageNews5,
                            alt: {
                                ru: 'Изображение 5',
                                en: 'Image 5'
                            }
                        },
                        {
                            path: 'Image-2.jpg',
                            url: imageNews2,
                            alt: {
                                ru: 'Изображение 2',
                                en: 'Image 2'
                            }
                        },
                        {
                            path: 'Image-6.jpg',
                            url: imageNews6,
                            alt: {
                                ru: 'Изображение 6',
                                en: 'Image 6'
                            }
                        },
                    ] 
                }
            ]
           
        },
        orderBlock: { //-------------------------OrderBlock--------------------
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
                data: ''
            },
            phone: {
                label: {
                    en: 'Your phone',
                    ru: 'Ваш телефон'
                },
                data: ''
            },
            email: {
                label: {
                    en: 'Your email*',
                    ru: 'Ваша почта*'
                },
                data: ''
            },
            message: {
                label: {
                    en: 'Information about the order (at least 10 symbols)*',
                    ru: 'Информация о заказе (минимум 10 символов)*'
                },
                data: ''
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
                    ru: 'Выберете файлы'
                },
                linkRest: {
                    en: 'or drag it here',
                    ru: 'для добавления или перетащите их сюда'
                },
                filesList: [
                ]

            },
            qrcode: imageNews1,
            text: {
                en: [
                    {
                        part: 'Lofdgdf fdjg df djkfh kdfh dsfkjdfks dksf hgksdfghkdjfs hdfk dfks df df  f dkjfghdkjfg   gdsk dfgkdfh gdfkj',
                    },
                    {
                        part: 'Lofdgdf fdjg df djkfh kdfh dsfkjdfks dksf hgksdfghkdjfs hdfk dfks df df  f dkjfghdkjfg   gdsk dfgkdfh gdfkj',
                    },
                    {
                        part: 'Telegram contact: fdsgdfg dfgkh dfj',
                    },
                    {
                        part: 'Email for making an order: dfgdsf g@defsg.rt',
                    },
                ],
                ru: [
                    {
                        part: 'Хотите заказать 3д печать? Пишите нам в телеграмме. Рассчитаем стоимость и сроки изготовления, а так же поможем с выбором материала. По завершению печати отправим фото или видео с готовыми изделиями.',
                    },
                    {
                        part: 'Работаем как с физическими, так и с юридическими лицами',
                    },
                    {
                        part: 'Переходите по ссылке:  https://t.me/n0mad_047',
                    },
                    {
                        part: 'Так же вы можете связаться с нами по электронной почте: v.rx@yandex.ru',
                    },
                ],
            }
        },
















        portfolios: {
            list: []
        },
        nav: {
            mobOpened: false,
            desktopOpened: true
        },
    },
    portfolios: {
        //status: 'idle',
        list: []
    },
    sliderMax: {
        dataLoading: {
            status: 'idle',
            message: '',
        },
        list: []
    },
    nav: {
        mobOpened: false,
        desktopOpened: true
    },
    
}


export default initialState;