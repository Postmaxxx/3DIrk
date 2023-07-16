import { TId, TLangText } from "../../interfaces"

export interface IFiberProperties {
    _id: TId
    name: TLangText
    tip: TLangText
    unit: TLangText
    type: string
}


export const fibersProperties = [
    {
        _id: 'strength',
        name: {
            en: 'Strength',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: 'MPa',
            ru: 'Мпа'
        },
        type: '10'
    },
    {
        _id: 'stiffnes',
        name: {
            en: 'Stiffnes',
            ru: 'SПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '10'
    },
    {
        _id: 'durability',
        name: {
            en: 'Durability',
            ru: 'DПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '10'
    },
    {
        _id: 'resistantImpact',
        name: {
            en: 'Impact resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '10'
    },
    {
        _id: 'minTemp',
        name: {
            en: 'Min usage temp',
            ru: 'mПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '°C',
            ru: '°C'
        },
        type: 'string'
    },
    {
        _id: 'maxTemp',
        name: {
            en: 'Max usage temp',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '°C',
            ru: '°C'
        },
        type: 'string'
    },
    {
        _id: 'thermalExpansion',
        name: {
            en: 'Thermal expansion',
            ru: 'svПрочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: 'µm/m-°C',
            ru: 'µm/m-°C'
        },
        type: 'string'

    },
    {
        _id: 'density',
        name: {
            en: 'Density',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: 'g/cm3',
            ru: 'г/см3'
        },
        type: 'string'

    },
    {
        _id: 'flexible',
        name: {
            en: 'Flexible',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'
    },
    {
        _id: 'elastic',
        name: {
            en: 'Elastic',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'soft',
        name: {
            en: 'Soft',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'composite',
        name: {
            en: 'Composite',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'resistantUV',
        name: {
            en: 'UV resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'resistantWater',
        name: {
            en: 'Water resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'dissolvable',
        name: {
            en: 'Dissolvable',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'resistantHeat',
        name: {
            en: 'Heat resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'resistantChemically',
        name: {
            en: 'Chemically resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'resistantFatigue',
        name: {
            en: 'Fatigue resistant',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'cutting',
        name: {
            en: 'Cutting',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'grinding',
        name: {
            en: 'Grinding',
            ru: 'Прочность'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: '',
            ru: ''
        },
        type: '3'

    },
    {
        _id: 'price',
        name: {
            en: 'Price',
            ru: 'Цена'
        },
        tip: {
            en: 'The maximum stress that a material can withstand without breaking.',
            ru: 'Максимальная нагрузка, которую материал может выдержать без разрушения.'
        },
        unit: {
            en: 'rub/gr',
            ru: 'руб/гр'
        },
        type: '5'
    },
    {
        _id: 'priceGr',
        name: {
            en: 'Price for gr.',
            ru: 'Цена за грамм'
        },
        tip: {
            en: 'Цена за грамм',
            ru: 'Цена за грам'
        },
        unit: {
            en: 'rub/gr',
            ru: 'руб/гр'
        },
        type: 'string'
    },
] satisfies IFiberProperties[]
