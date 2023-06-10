import { INewsItem } from 'src/interfaces';
import newsImage1 from '../../assets/img/news/news_1.webp'
import newsImage2 from '../../assets/img/news/news_2.webp'
import newsImage3 from '../../assets/img/news/news_3.webp'
import newsImage4 from '../../assets/img/news/news_4.webp'

const currentDate: Date = new Date;

const mockNews: INewsItem[] = [
    {
        id: 'n1',
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
            en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!',
            ru: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра\nВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
        },
        images: [
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
            {
                url: newsImage3,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: newsImage4,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
        ],
    },
    {
        id: 'n2',
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
            en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!',
            ru: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра\nВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
        },
        images: [
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
        id: 'n3',
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
            en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!',
            ru: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра\nВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
        },
        images: [
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
        id: 'n4',
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
            en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!',
            ru: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра\nВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
        },
        images: [
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
        id: 'n5',
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
            en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempore atque et nostrum qui vitae! Dolor necessitatibus ipsum consectetur optio.\nLorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus, eveniet odit veritatis totam exercitationem id perspiciatis dolores, ipsum quos reprehenderit, consectetur facere harum rerum libero tempore incidunt modi! Placeat cumque quidem velit porro amet quam possimus dolorum eaque exercitationem quod!',
            ru: 'ВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра\nВАП в апва ып аволрп ывар лорвыа олывапрловы рпвыадлопрвы аплвоапр лвдаыпр влаорплв ыоарп лвдаырплваыодрплд ывраплва лоаврплвор влапрыдалопвырапл дрываплдывра авпрва пдрваыплопдорва лопвапрвыалод рпвлдаопрвал дпрвлдарпдлыварплвырап дывлаопрыдлв рапвыдлаопрылвдоарплдываорпфы жвапшщ вапврыап выарпваы п выалопрвалоыпр влап а'
        },
        images: [
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