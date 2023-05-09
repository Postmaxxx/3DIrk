import { INewsItem } from 'src/interfaces';
import newsImage1 from 'src/assets/img/news/1.png'
import newsImage2 from 'src/assets/img/news/2.jpeg'
import newsImage3 from 'src/assets/img/news/3.jpeg'

const currentDate: Date = new Date;

const mockNews: INewsItem[] = [
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
                url: newsImage1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
            {
                url: newsImage2,
                name: {
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
                url: newsImage2,
                name: {
                    ru: 'Изображение 2',
                    en: 'Image 2'
                }
            },
            {
                url: newsImage1,
                name: {
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
                url: newsImage3,
                name: {
                    ru: 'Изображение 2',
                    en: 'Image 2'
                }
            },
            {
                url: newsImage1,
                name: {
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
                url: newsImage2,
                name: {
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
                url: newsImage2,
                name: {
                    ru: 'Изображение 5',
                    en: 'Image 5'
                }
            },
            {
                url: newsImage3,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
        ],
    },
    
]


export default mockNews