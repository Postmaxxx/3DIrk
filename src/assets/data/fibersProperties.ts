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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
            en: '°C',
            ru: '°C'
        }
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
        }
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
        }
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
        }
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
        }
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
        }
    },
] satisfies IFiberProperties[]
