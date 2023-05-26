import { TPropertiesValues } from "src/interfaces"

export const propertiesList = [
    "strength",
    "stiffnes",
    "durability",
    "minTemp",
    "maxTemp",
    "thermalExpansion",
    "density",
    "flexible",
    "elastic",
    "resistantImpact",
    "soft",
    "composite",
    "resistantUV",
    "resistantWater",
    "dissolvable",
    "resistantHeat",
    "resistantChemically",
    "resistantFatigue",
    "cutting",
    "grinding",
    "speed",
    "price",
] as const


export const propertiesValues: TPropertiesValues = {
    strength: {
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
    stiffnes: {
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
    durability: {
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
    minTemp: {
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
    maxTemp: {
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
    thermalExpansion: {
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
    density: {
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
    price: {
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
    flexible: {
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
    elastic: {
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
    resistantImpact: {
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
    soft: {
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
    composite: {
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
    resistantUV: {
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
    resistantWater: {
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
    dissolvable: {
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
    resistantHeat: {
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
    resistantChemically: {
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
    resistantFatigue: {
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
    cutting: {
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
    grinding: {
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
    speed: {
        name: {
            en: 'Printing speed',
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
}
