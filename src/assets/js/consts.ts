import { IFetch, IFiberParam, IMessageModal, ISendColor, ISendFiber, ISendProduct, TLangText } from "../../interfaces"

const timeModalClosing: number = 500 //transition of closing modal window

const gapBetweenRequests: number = 2000 //time between requests in case of error

const strengthMin = 1 //fiber strength min
const strengthMax = 180 //fiber strength max

const usersPerPage = 2 //for Admin for AllOrders page

const tipsTransition = 3000

const socials = {
    vk: "#",
    instagram: "#",
    youtube: "#",
    telegram: "#",
}

const inputsProps = { //restrictions of inputs
    email: {
        min: 6,
        max: 50
    },
    name: {
        min: 2,
        max: 40
    },
    phone: {
        min: 6,
        max: 25
    },
    message: {
        min: 20,
        max: 4000
    },
    password: {
        min: 8,
        max: 40
    },
    category: {
        min: 3,
        max: 20
    },
    color: {
        min: 2,
        max: 30
    },
    news: {
        header: {
            min: 5,
            max: 60
        },
        textShort: {
            min: 20,
            max: 200
        },
        textFull: {
            min: 40,
            max: 5000
        }
    },
    fiber: {
        nameShort: {
            min: 2,
            max: 15
        },
        nameFull: {
            min: 2,
            max: 30
        },
        textShort: {
            min: 10,
            max: 100
        },
        textFull: {
            min: 100,
            max: 5000
        },
        proscons : {
            min: 3,
            max: 200
        }
    },
    date: {
        min: new Date("2020-01-01"),
        max: new Date("2030-01-01")
    }
}

const clearModalMessage: IMessageModal = {
    status: '',
    header: '',
    text: [''],
}

const resetFetch: IFetch = {
    status: 'idle',
    message: {en: '', ru: ''},
    errors: []
}

const fetchingFetch: IFetch = {
    status: 'fetching',
    message: {en: '', ru: ''},
    errors: []
}

const errorFetch: IFetch = {
    status: 'error',
    message: {en: '', ru: ''},
    errors: []
}

const successFetch: IFetch = {
    status: 'success',
    message: {en: '', ru: ''},
    errors: []
}


const headerStatus = {
    success: {
        en: 'Success',
        ru: 'Успех'
    },
    error: {
        en: 'Error',
        ru: 'Ошибка'
    }
}


const empty: TLangText = {
    en: '',
    ru: ''
}

const selector = {
    "10": [
        {   
            value: '1',
            name: {
                en: 'none',
                ru: 'отсутствует'
            }
        },
        {   
            value: '2',
            name: {
                en: 'extremely low',
                ru: 'крайне низкая'
            }
        },
        {   
            value: '3',
            name: {
                en: 'low',
                ru: 'низкая'
            }
        },
        {   
            value: '4',
            name: {
                en: 'poor',
                ru: 'посредственная'
            }
        },
        {   
            value: '5',
            name: {
                en: 'below average',
                ru: 'ниже средней'
            }
        },
    
        {   
            value: '6',
            name: {
                en: 'average',
                ru: 'средняя'
            }
        },
    
        {   
            value: '7',
            name: {
                en: 'upper average',
                ru: 'хорошая'
            }
        },
    
        {   
            value: '8',
            name: {
                en: 'hign',
                ru: 'высокая'
            }
        },
    
        {   
            value: '9',
            name: {
                en: 'very high',
                ru: 'очень высокая'
            }
        },
    
        {   
            value: '10',
            name: {
                en: 'exellent',
                ru: 'отличная'
            }
        },
    ],
    "5": [
        {   
            value: '1',
            name: {
                en: 'low',
                ru: 'низкая'
            }
        },
        {   
            value: '2',
            name: {
                en: 'below average',
                ru: 'ниже средней'
            }
        },
        {   
            value: '3',
            name: {
                en: 'average',
                ru: 'средняя'
            }
        },
        {   
            value: '4',
            name: {
                en: 'upper average',
                ru: 'выше средней'
            }
        },
        {   
            value: '5',
            name: {
                en: 'high',
                ru: 'высокая'
            }
        },
    ],
    "3": [
        {   
            value: '1',
            name: {
                en: 'none',
                ru: 'отсутствует'
            }
        },
        {   
            value: '2',
            name: {
                en: 'average',
                ru: 'средняя'
            }
        },
        {   
            value: '3',
            name: {
                en: 'high',
                ru: 'высокая'
            }
        },
    ]
    
}

const fiberEmpty: ISendFiber = {
    _id: '',
    name: {...empty},
    text: {...empty},
    short: {
        name:{...empty},
        text:{...empty},
    },
    proscons: {
        pros: [],
        cons: []
    },
    colors: [],
    params: {} as IFiberParam,
    files: [] as File[],
}


const productEmpty: ISendProduct = {
    _id: '',
    name: {...empty},
    text: {...empty},
    price: {...empty},
    text_short:{...empty},
    fibers: [],
    mods: [],
    category: '',
    files: [] as File[],
}


const colorEmpty: ISendColor = {
    _id: '', 
    name: {...empty}, 
    files: {
        full: new File([], ""),
        thumb: new File([], "")
    },
}

const orderStatus = [
    {
        value: 'new',
        name: 'New'
    },
    {
        value: 'working',
        name: 'In progress'
    },
    {
        value: 'finished',
        name: 'Finished'
    },
    {
        value: 'canceled',
        name: 'Canceled'
    },
]


const timeOffset = (new Date()).getTimezoneOffset() / 60

const navList = {
    home: {
        en: "HOME",
        ru: "ГЛАВНАЯ",
        to: "/"
    },
    fibers: {
        en: "FIBERS",
        ru: "МАТЕРИАЛЫ",
        to: "/fibers",
        about: {
            en: "ABOUT",
            ru: "О ФИЛАМЕНТАХ",
            to: "/fibers"
        },
        compare: {
            en: "COMPARASING",
            ru: "СРАВНЕНИЕ",
            to: "/fibers/compare"
        }
    },
    catalog: {
        en: "CATALOG",
        ru: "КАТАЛОГ",
        to: "/catalog"
    },
    contacts: {
        en: "CONTACT",
        ru: "КОНТАКТЫ",
        to: "/contact_us"
    },
    account: {
        en: "ACCOUNT",
        ru: "КАБИНЕТ",
        orders: {
            en: "ORDERS",
            ru: "ЗАКАЗЫ",
            to: "/orders"
        },
        cart: {
            en: "CART",
            ru: "КОРЗИНА",
            to: "/order"
        },
        admin: {
            news: {
                en: "+ NEWS",
                ru: "+ НОВОСТЬ",
                to: "/admin/news-create"
            },
            color: {
                en: "+ COLOR",
                ru: "+ ЦВЕТ",
                to: "/admin/color-create"
            },
            fiber: {
                en: "+ FIBER",
                ru: "+ МАТЕРИАЛ",
                to: "/admin/fiber-create"
            },
            catalog: {
                en: "+ CATALOG",
                ru: "+ КАТАЛОГ",
                to: "/admin/catalog-change"
            },
            product: {
                en: "+ PRODUCT",
                ru: "+ ТОВАР",
                to: "/admin/product-create"
            },
            content: {
                en: "+ CONTENT",
                ru: "+ КОНТЕНТ",
                to: "/admin/splider-change"
            }
        },
        login: {
            en: "LOGIN",
            ru: "ВХОД",
        },
        logout: {
            en: "LOGOUT",
            ru: "ВЫХОД",
        }
    }
};

export { clearModalMessage, resetFetch, timeModalClosing, 
    fetchingFetch, errorFetch, successFetch, headerStatus, empty, selector, strengthMin, 
    strengthMax, fiberEmpty, productEmpty, colorEmpty, gapBetweenRequests,
    orderStatus, usersPerPage, timeOffset, inputsProps, tipsTransition, socials,
    navList}