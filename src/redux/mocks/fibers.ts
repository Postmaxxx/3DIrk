import { IFiber } from "src/interfaces";
import pla_1 from '../../assets/img/fibers/pla/pla_1.webp'
import pla_2 from '../../assets/img/fibers/pla/pla_2.webp'
import pla_3 from '../../assets/img/fibers/pla/pla_3.webp'
import pla_4 from '../../assets/img/fibers/pla/pla_4.webp'
import pla_5 from '../../assets/img/fibers/pla/pla_5.webp'
import pla_6 from '../../assets/img/fibers/pla/pla_6.webp'

import petg_1 from '../../assets/img/fibers/petg/petg_1.webp'
import petg_2 from '../../assets/img/fibers/petg/petg_2.webp'
import petg_3 from '../../assets/img/fibers/petg/petg_3.webp'
import petg_4 from '../../assets/img/fibers/petg/petg_4.webp'
import petg_5 from '../../assets/img/fibers/petg/petg_5.webp'
import petg_6 from '../../assets/img/fibers/petg/petg_6.webp'
import petg_7 from '../../assets/img/fibers/petg/petg_7.webp'
import petg_8 from '../../assets/img/fibers/petg/petg_8.webp'



const mockFibers = [
    {
        id: 'f_PLA',
        colors: ["c_lilac_pearl", "c_orange", "c_pink", "c_raspberry", "c_torque"],
        name: {
            ru: 'PLA (полилактид)',
            en: 'PLA (polyactid)'
        },
        short: {
            name: {
                ru: 'PLA',
                en: 'PLA'
            },
            descr: {
                en: 'PLA is the go-to material for most users due to its ease-of-use, dimensional accuracy, and low cost.',
                ru: 'PLA распостраненный материал для печати благодаря низкой цене и хорошим характеристикам.'
            }
        },
        text: {
            en: 'The most common material for 3D printing is available in numerous colors and fillings, primarily for decorative purposes. Some manufacturers produce PLA filled with marble crumbs, metal powder, or wood fibers, which gives the plastic parts the appearance of metal, stone, or wood.\nPolylactic acid (PLA) is made from corn or sugarcane and is environmentally friendly since products made from it decompose in natural conditions.',
            ru: 'Самый распространённый материал для 3д печати, встречается множество расцветок и наполнений, в основном, декоративного характера. Некоторые производители выпускают PLA, наполненный мраморной крошкой, металлической пудрой или древесными волокнами, из-за чего внешне пластиковые детали становятся похожими на металл, камень или дерево.\nПолилактид производится из кукурузы или сахарного тростника, экологичен, так, как изделия из него разлагаются в природных условиях '
        },
        proscons: {
            pros: [
                {
                    en: 'Stiff and good strength',
                    ru: 'Высокая прочность и жесткость'
                },
                {
                    en: 'Good dimensional accuracy',
                    ru: 'Хорошая точность печати'
                },
                {
                    en: 'Good shelf life',
                    ru: 'Большой срок годности'
                },
                {
                    en: 'Low cost',
                    ru: 'Низкая стоимость'
                },
                {
                    en: 'Suitable for decorative elements',
                    ru: 'Хорошо подходит для печати элементов декора'
                },
                {
                    en: 'Suitable for models with movable joints',
                    ru: 'Подходит для моделей с подвижными соединениями'
                },
                
            ],
            cons: [
                {
                    en: 'Non UV resistant',
                    ru: 'Боится солнечных лучей'
                },
                {
                    en: 'Low heat resistance',
                    ru: 'Низкая устойчивость к высоким температурам'
                },
                {
                    en: 'Narrow temperature range of use',
                    ru: 'Узкий температурный диапазон использования'
                },
                {
                    en: 'Not suitable for contact with food',
                    ru: 'Не подходит для контактов с пищей'
                },
                {
                    en: 'Low impact resistance',
                    ru: 'Низкая ударопрочность'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Подходит для маленьких моделей',
                    en: 'Suitable for small models'
                }
            },
            {
                url: pla_2,
                name: {
                    ru: 'Подходит для ненагруженных механизмов',
                    en: 'Suitable for lightly loaded mechanisms'
                }
            },
            {
                url: pla_3,
                name: {
                    ru: 'Подходит для декоративных элементов',
                    en: 'Suitable for decorative elements'
                }
            },
            {
                url: pla_4,
                name: {
                    ru: 'Подходит для моделей с подвижными соединениями',
                    en: 'Suitable for models with movable joints'
                }
            },
            {
                url: pla_5,
                name: {
                    ru: 'Подходит для печати деталей интерьера',
                    en: 'Suitable for printing interior parts'
                }
            },
            {
                url: pla_6,
                name: {
                    ru: 'Подходит для печати запасных частей без высоких требований к качеству',
                    en: 'Suitable for printing spare parts without high quality requirements'
                }
            },
        ],
        features: [
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'дихлорметан, дихлорэтан',
                        en: 'dichloromethane, dichloroethane'
                    }
                },
        ],
        params: {
            strength: 65,
            stiffnes: 7,
            durability: 4,
            resistantImpact: 3,
            minTemp: -20,
            maxTemp: 45,
            thermalExpansion: 80 ,
            density: 1.24 ,
            price: 1,
            flexible: 0,
            elastic: 0,
            soft: 0,
            composite: 0,
            resistantUV: 0,
            resistantWater: 0,
            dissolvable: 0,
            resistantHeat: 0,
            resistantChemically: 0,
            resistantFatigue: 0,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4-6',
        }
    },







//------------------------------------------------------------------------------------------------------
    {
        id: 'f_PETg',
        colors: ["c_amber", "c_blue", "c_blue_dark", "c_cooper", "c_corn", "c_emerald", "c_lilac_pearl", "c_orange", "c_pink", "c_raspberry", "c_torque"],
        name: {
            ru: 'PETg (полиэтилентерефталат, модифицированный гликолем)',
            en: 'PETg (Polyethylene, terephthalate modified with glycol)'
        },
        short: {
            name: {
                ru: 'PETg',
                en: 'PETg'
            },
            descr: {
                en: 'PETG filament is known for their ease of printability, smooth surface finish, and water resistance.',
                ru: 'PETG filament is known for their ease of printability, smooth surface finish, and water resistance.'
            }
        },
        text: {
            en: 'Indeed, this material is most commonly used for manufacturing technical parts, and it handles heat better than PLA and is not susceptible to sunlight. PETg is available in various colors, with fillings resembling stone, metal, or wood, although, like PLA, it is less commonly encountered.',
            ru:  'Именно, этот материал чаще всего используют для изготовления технических деталей, лучше, чем PLA переносит нагрев, не боится солнечного света. Выпускается PETg в различных цветах, наполнение под камень, металл или дерево, как в случае с PLA, встречается редко.'
        },
        proscons: {
            pros: [
                {
                    en: 'Glossy and smooth surface finish',
                    ru: 'Глянцевая и гладкая поверхность'
                },
                {
                    en: 'High durability',
                    ru: 'Высокая долговечность'
                },
                {
                    en: 'Good shelf life',
                    ru: 'Большой срок годности'
                },
                {
                    en: 'Low cost',
                    ru: 'Низкая стоимость'
                },
                {
                    en: 'Suitable for decorative elements',
                    ru: 'Хорошо подходит для печати элементов декора'
                },
                {
                    en: 'UV resistant',
                    ru: 'Не боится солнечных лучей'
                },
                {
                    en: 'Wide temperature range of use',
                    ru: 'Широкий температурный диапазон использования'
                },
                
            ],
            cons: [
                {
                    en: 'Not suitable for contact with food',
                    ru: 'Не подходит для контактов с пищей'
                },
                {
                    en: 'Low impact resistance',
                    ru: 'Низкая ударопрочность'
                },

            ]
        },
        imgs: [
            {
                url: petg_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
            {
                url: petg_2,
                name: {
                    ru: '',
                    en: ''
                }
            },
            {
                url: petg_3,
                name: {
                    ru: '',
                    en: ''
                }
            },
            {
                url: petg_4,
                name: {
                    ru: '',
                    en: ''
                }
            },
            {
                url: petg_5,
                name: {
                    ru: '',
                    en: ''
                }
            },
            {
                url: petg_6,
                name: {
                    ru: '',
                    en: ''
                }
            },
            {
                url: petg_7,
                name: {
                    ru: '',
                    en: ''
                }
            },
            {
                url: petg_8,
                name: {
                    ru: '',
                    en: ''
                }
            },
        ],
        features: [
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'дихлорметан, дихлорэтан',
                        en: 'dichloromethane, dichloroethane'
                    }
                },
            ],
        params: {
            strength: 53,
            stiffnes: 10,
            durability: 7,
            resistantImpact: 3,
            minTemp: -40,
            maxTemp: 70,
            thermalExpansion: 60 ,
            density: 1.23,
            price: 2,
            flexible: 0,
            elastic: 0,
            soft: 0,
            composite: 0,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 0,
            resistantHeat: 0,
            resistantChemically: 2,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4.5-6.5',
        }

    },



//------------------------------------------------------------------------------------------------------

    {
        id: 'f_ABS',
        colors: ["c_b", "c_w", "c_t"],
        name: {
            ru: 'ABS (Акрилонитрил бутадиен стирол)',
            en: 'ABS (Acrylonitrile Butadiene Styrene)'
        },
        short: {
            name: {
                ru: 'ABS',
                en: 'ABS'
            },
            descr: {
                en: 'ABS is a low-cost material, great for printing tough and durable parts that can withstand high temperatures.',
                ru: 'ABS is a low-cost material, great for printing tough and durable parts that can withstand high temperatures.'
            }
        },
        text: {
            en: 'Poor meltability and high shrinkage of ABS plastic result in low strength. However, this plastic has good thermal resistance. It is most commonly used for 3D printing interior/exterior parts of automobiles. Without paint or coating, it is susceptible to direct sunlight.',
            ru:  'Плохая спекаемость и высокая усадка ABS пластика влекут за собой низкую прочность, однако, данный пластик обладает хорошей термостойкостью. Чаще всего из него печатают детали интерьера/экстерьера автомобиля. Без покрытия краской или лаком боится открытых солнечных лучей.'
        },
        proscons: {
            pros: [
                {
                    en: 'Very high hardeness',
                    ru: '+'
                },
                {
                    en: 'Good for toys',
                    ru: '+'
                },
            ],
            cons: [
                {
                    en: 'Non UV resistant',
                    ru: '-'
                },
                {
                    en: 'Toxic',
                    ru: '+'
                },
            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
        ],
        params: {
            strength: 103,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2,
            elastic: 2,
            resistantImpact: 1,
            soft: 1,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '1-2',
        }
        
    },
    










//------------------------------------------------------------------------------------------------------

    {
        id: 'f_ASA',
        colors: ["c_w"],
        name: {
            ru: 'ASA (акрилонитрил стирол акрилат)',
            en: 'ASA (Acrylonitrile Styrene Acrylate)'
        },
        short: {
            name: {
                ru: 'ASA',
                en: 'ASA'
            },
            descr: {
                en: 'ASA is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.',
                ru: 'ASA is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.'
            }
        },
        text: {
            en:  'ASA is a relative of ABS plastic and shares the same physical properties as its counterpart. The most significant and only difference between them is that ASA has high weather resistance and, in its uncolored form, is not susceptible to direct sunlight.',
            ru: 'ASA является родственником ABS пластика, обладает теми же физическими свойствами, что и его собрат. Важнейшее и единственное отличие между ними – ASA обладает высокой атмосферостойкостью, в неокрашенном виде не боится прямых солнечных лучей.'
        },
        proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
            ],
        params: {
            strength: 130,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 0,
            soft: 1,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '9',
        }
    },
    






    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_PA',
        colors: ["c_b"],
        name: {
            ru: 'PA (полиамид/нейлон)',
            en: 'PA (Polyamide/Nylon)'
        },
        short: {
            name: {
                ru: 'PA',
                en: 'PA'
            },
            descr: {
                en: 'PA bla.... is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.',
                ru: 'PA bla....  is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.'
            }
        },
        text: {
            en: 'Polyamide is resistant to petroleum products and solvents. Due to its low friction, it is particularly well-suited for manufacturing bushings and gears, where lubrication is not necessary. Thanks to its high strength, even in freezing conditions, the parts retain their functionality',
            ru:  'Полиамид стоек к нефтепродуктам и растворителям, из-за низкого трения он лучше всего подходит для изготовления втулок, шестерен, при этом смазка не обязательна. Из-за высокой прочности, даже, на морозе детали сохраняют работоспособность.'
        },
        proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя',
                    en: 'medium'
                }
            },
        ],
        params: {
            strength: 70,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 1,
            soft: 1,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2,
            priceGr: '4-6',
        }
    },







//------------------------------------------------------------------------------------------------------

    {
        id: 'f_CABS',
        colors: ["c_b"],
        name: {
            ru: 'Композиты на основе ABS',
            en: 'Composites based on ABS'
        },
        short: {
            name: {
                ru: 'ABS+',
                en: 'ABS+'
            },
            descr: {
                en: 'bla.... is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.',
                ru: 'bla....  is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.'
            }
        },
        text: {
            en: 'Poor meltability and high shrinkage of ABS plastic result in low strength. However, this plastic has good thermal resistance. It is most commonly used for 3D printing interior/exterior parts of automobiles. Without paint or coating, it is susceptible to direct sunlight. By adding glass and carbon fibers, the strength and stiffness are increased.\n\n\n Types of fibers:\n\nGF (glass fibers)\nCF (carbon fibers)',
            ru: 'Плохая спекаемость и высокая усадка ABS пластика влекут за собой низкую прочность, однако, данный пластик обладает хорошей термостойкостью. Чаще всего из него печатают детали интерьера/экстерьера автомобиля. Без покрытия краской или лаком боится открытых солнечных лучей. Благодаря добавлению стеклянных и углеродных нитей повышается прочность и жёсткость.\n\n\nВиды нитей:\nGF (стеклянные нити)\nCF (углеродные нити)'
        },
        proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя',
                    en: 'medium'
                }
            },
        ],
        params: {
            strength: 39,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 1,
            soft: 1,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4-6',
        }
        
    },












        
    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_CN',
        colors: ["c_b"],
        name: {
            ru: 'Композиты на основе нейлона',
            en: 'Composites based on nylon'
        },
        short: {
            name: {
                ru: 'НЕЙЛОН+',
                en: 'NYLON+'
            },
            descr: {
                en: 'bla.... is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.',
                ru: 'bla....  is a common alternative to ABS and is great for outdoor applications due to its high UV, temperature, and impact resistance.'
            }
        },
        text: {
            en:  'Polyamide is resistant to petroleum products and solvents. Due to its low friction, it is particularly well-suited for manufacturing bushings and gears, where lubrication is not necessary. Thanks to its high strength, even in freezing conditions, the parts retain their functionality. By adding glass and carbon fibers, the strength and stiffness are increased.\n\n\nTypes of fibers:\nGF (glass fibers)\nCF (carbon fibers)',
            ru: 'Полиамид стоек к нефтепродуктам и растворителям, из-за низкого трения он лучше всего подходит для изготовления втулок, шестерен, при этом смазка не обязательна. Из-за высокой прочности, даже, на морозе детали сохраняют работоспособность. Благодаря добавлению стеклянных и углеродных нитей повышается прочность и жёсткость.\n\n\nВиды нитей:\nGF (стеклянные нити)\nCF (углеродные нити)'
        },
            proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя',
                    en: 'medium'
                }
            },
        ],
        params: {
            strength: 160,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 1,
            soft: 0,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 0,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4-6',
        }
    },








    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_PC',
        colors: ["c_b", 'c_m', 'c_w', 'c_r', "c_b", "c_g"],
        name: {
            ru: 'PC (поликарбонат)',
            en: 'PC (Polycarbonate)'
        },
        short: {
            name: {
                ru: 'PC',
                en: 'PC'
            },
            descr: {
                en: 'Polycarbonate is known for its strength and durability. It has very high heat and impact resistance making it an ideal choice for tough environments.',
                ru: 'Polycarbonate is known for its strength and durability. It has very high heat and impact resistance making it an ideal choice for tough environments.'
            }
        },
        text: {
            en:  'Polycarbonate stands out among materials with its wide range of operating temperatures and high wear resistance. It is non-combustible.',
            ru:  'Поликарбонат из спектра материалов выделяется широким диапазоном рабочих температур и высокой износостойкостью. Не поддерживает горение.'
        },
        proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя',
                    en: 'medium'
                }
            },
        ],
        params: {
            strength: 3,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 1,
            soft: 1,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4-6',
        }
    },


















    

    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_PP',
        colors: ["c_b", 'c_m', 'c_w', 'c_r', "c_b", "c_g"],
        name: {
            ru: 'PP (полипропилен)',
            en: 'PP (polypropylene)'
        },
        short: {
            name: {
                ru: 'PP',
                en: 'PP'
            },
            descr: {
                en: 'Polypropylene is great for high-cycle, low strength applications due to its fatigue resistance, semi-flexible, and lightweight characteristics.',
                ru: 'Polypropylene is great for high-cycle, low strength applications due to its fatigue resistance, semi-flexible, and lightweight characteristics.'
            }
        },
        text: {
            en:  'Polypropylene possesses high fatigue strength, and parts made from it can withstand multiple flexural cycles.',
            ru:  'Полипропилен обладает высокой усталостной прочностью, детали, изготовленные из него выдерживают многократные изгибы.'
        },
        proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя',
                    en: 'medium'
                }
            },
        ],
        params: {
            strength: 3,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 1,
            soft: 1,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4-6',
        }
    },









    
    

    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_SEBS',
        colors: ["c_b", 'c_m', 'c_w', 'c_r', "c_b", "c_g"],
        name: {
            ru: 'SEBS (стирол этилен бутадиен стирол)',
            en: 'SEBS (Styrene Ethylene Butadiene Styrene)'
        },
        short: {
            name: {
                ru: 'SEBS',
                en: 'SEBS'
            },
            descr: {
                en: 'bla... is great for high-cycle, low strength applications due to its fatigue resistance, semi-flexible, and lightweight characteristics.',
                ru: 'bla... is great for high-cycle, low strength applications due to its fatigue resistance, semi-flexible, and lightweight characteristics.'
            }
        },
        text: {
            en: 'Thermoplastic elastomer, similar to rubber in physical properties, is often used in modeling for the production of tires, tracks, and damping pads.',
            ru: 'Термопластичный эластомер, по физическим свойствам похож на резину, а потому в моделировании его часто применяют для изготовления шин и гусениц, демпфирующих прокладок.'
        },
        proscons: {
            pros: [
                {
                    en: '+',
                    ru: '+'
                },

            ],
            cons: [
                {
                    en: '-',
                    ru: '-'
                },

            ]
        },
        imgs: [
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 1',
                    en: 'Image 1'
                }
            },
        ],
        features: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя',
                    en: 'medium'
                }
            },
        ],
        params: {
            strength: 3,
            stiffnes: 1,
            durability: 8,
            minTemp: 10,
            maxTemp: 90,
            thermalExpansion: 170 ,
            density: 1.44 ,
            price: 4 ,
            flexible: 2 ,
            elastic: 2,
            resistantImpact: 1,
            soft: 0,
            composite: 1 ,
            resistantUV: 2,
            resistantWater: 2,
            dissolvable: 1,
            resistantHeat: 2,
            resistantChemically: 1,
            resistantFatigue: 2,
            cutting: 2,
            grinding: 2 ,
            priceGr: '4-6',
        }
    },


] satisfies Array<IFiber>

export default mockFibers