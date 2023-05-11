import { IFiber } from "src/interfaces";
import fiberImage1 from 'src/assets/img/fibers/1.png'
import fiberImage2 from 'src/assets/img/fibers/2.jpeg'
import fiberImage3 from 'src/assets/img/fibers/3.jpeg'
import fiberImage4 from 'src/assets/img/fibers/4.jpeg'
import fiberImage5 from 'src/assets/img/fibers/5.png'
import fiberImage6 from 'src/assets/img/fibers/6.png'

const mockFibers = [
    {
        id: 'f1',
        colors: [
            {
                name: {
                    ru: 'Красный',
                    en: 'Red'
                },
                value: 'FF0000'
            },
            {
                name: {
                    ru: 'Зеленый',
                    en: 'Green'
                },
                value: '00FF00'
            },
            {
                name: {
                    ru: 'Синий',
                    en: 'Blue'
                },
                value: '0000FF'
            },
            {
                name: {
                    ru: 'Желтый',
                    en: 'Yellow'
                },
                value: 'FFFF00'
            },
            {
                name: {
                    ru: 'Фиолетовый',
                    en: 'Violet'
                },
                value: 'FF00FF'
            },
            {
                name: {
                    ru: 'Разноцветный',
                    en: 'Mixed'
                },
                value: 'mixed'
            }
        ],
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
                url: fiberImage1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
            {
                url: fiberImage2,
                name: {
                    ru: 'Изображение 2',
                    en: 'Image 2'
                }
            },
            {
                url: fiberImage3,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: fiberImage4,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: fiberImage5,
                name: {
                    ru: 'Изображение 5',
                    en: 'Image 5'
                }
            },
            {
                url: fiberImage6,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'Прочность',
                    en: 'Hardness'
                },
                value: {
                    ru: 'Очень высокая',
                    en: 'Very high'
                }
            },
            {
                name: {
                    ru: 'Жёсткость',
                    en: 'Toughness'
                },
                value: {
                    ru: 'Очень высокая',
                    en: 'Very high'
                }
            },
            {
                name: {
                    ru: 'Температура эксплуатации',
                    en: 'Expluatation tempreture'
                },
                value: {
                    ru: '-20…+45°С',
                    en: '-20…+45°C'
                }
            },
        ]
    },
    {
        id: 'f2',
        colors: [
            {
                name: {
                    ru: 'Зеленый',
                    en: 'Green'
                },
                value: '00FF00'
            },
            {
                name: {
                    ru: 'Разноцветный',
                    en: 'Mixed'
                },
                value: 'mixed'
            }
        ],
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
                url: fiberImage3,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: fiberImage5,
                name: {
                    ru: 'Изображение 5',
                    en: 'Image 5'
                }
            },
            {
                url: fiberImage2,
                name: {
                    ru: 'Изображение 2',
                    en: 'Image 2'
                }
            },
            {
                url: fiberImage6,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'Прочность',
                    en: 'Hardness'
                },
                value: {
                    ru: 'Средняя',
                    en: 'Medium'
                }
            },
            {
                name: {
                    ru: 'Жёсткость',
                    en: 'Toughness'
                },
                value: {
                    ru: 'Низкая',
                    en: 'Bad'
                }
            },
            {
                name: {
                    ru: 'Температура эксплуатации',
                    en: 'Expluatation tempreture'
                },
                value: {
                    ru: '0…+5°С',
                    en: '0…+5°C'
                }
            },
        ]
    },
    {
        id: 'f3',
        colors: [
            {
                name: {
                    ru: 'Белый',
                    en: 'White'
                },
                value: 'FFFFFF'
            },
            {
                name: {
                    ru: 'Разноцветный',
                    en: 'Mixed'
                },
                value: 'mixed'
            }
        ],
        header: {
            ru: 'ABS Пластик 3',
            en: 'ABS 3'
        },
        text: {
            en: [
                {
                    part: 'Plastic 3 gf hfgh dfghipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.'
                },
                {
                    part: 'f gdsfgdfggh Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum'
                },
            ],
            ru: [
                {
                    part: 'ВАП 3 авыпв а в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра'
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
                url: fiberImage6,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: fiberImage3,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: fiberImage4,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: fiberImage1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'Прочность',
                    en: 'Hardness'
                },
                value: {
                    ru: 'Средняя',
                    en: 'Medium'
                }
            },
            {
                name: {
                    ru: 'Жёсткость',
                    en: 'Toughness'
                },
                value: {
                    ru: 'Низкая',
                    en: 'Bad'
                }
            },
            {
                name: {
                    ru: 'Температура эксплуатации',
                    en: 'Expluatation tempreture'
                },
                value: {
                    ru: '0…+5°С',
                    en: '0…+5°C'
                }
            },
        ]
    }
] satisfies Array<IFiber>

export default mockFibers