import { IFiberProperties } from "src/interfaces"


export const fibersProperties = [
    {
        id: 'strength',
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
        id: 'stiffnes',
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
        id: 'durability',
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
        id: 'resistantImpact',
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
        id: 'minTemp',
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
        id: 'maxTemp',
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
        id: 'thermalExpansion',
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
        id: 'density',
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
        id: 'flexible',
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
        id: 'elastic',
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
        id: 'soft',
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
        id: 'composite',
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
        id: 'resistantUV',
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
        id: 'resistantWater',
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
        id: 'dissolvable',
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
        id: 'resistantHeat',
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
        id: 'resistantChemically',
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
        id: 'resistantFatigue',
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
        id: 'cutting',
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
        id: 'grinding',
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
        id: 'price',
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
        id: 'priceGr',
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
