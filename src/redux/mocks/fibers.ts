import { IFiber } from "src/interfaces";
import pla_1 from 'src/assets/img/fibers/pla/1.webp'
import pla_2 from 'src/assets/img/fibers/pla/2.webp'
import pla_3 from 'src/assets/img/fibers/pla/3.webp'
import pla_4 from 'src/assets/img/fibers/pla/4.webp'
import pla_5 from 'src/assets/img/fibers/pla/5.webp'
import pla_6 from 'src/assets/img/fibers/pla/6.webp'



const mockFibers = [
    {
        id: 'f_PLA',
        colors: ["c_b", "c_w", "c_t"],
        name: {
            ru: 'PLA (полилактид)',
            en: 'PLA (polyactid)'
        },
        text: {
            en: [
                {
                    part: 'The most common material for 3D printing is available in numerous colors and fillings, primarily for decorative purposes. Some manufacturers produce PLA filled with marble crumbs, metal powder, or wood fibers, which gives the plastic parts the appearance of metal, stone, or wood. '
                },
                {
                    part: 'Polylactic acid (PLA) is made from corn or sugarcane and is environmentally friendly since products made from it decompose in natural conditions.'
                },
            ],
            ru: [
                {
                    part: 'Самый распространённый материал для 3д печати, встречается множество расцветок и наполнений, в основном, декоративного характера. Некоторые производители выпускают PLA, наполненный мраморной крошкой, металлической пудрой или древесными волокнами, из-за чего внешне пластиковые детали становятся похожими на металл, камень или дерево. '
                },
                {
                    part: 'Полилактид производится из кукурузы или сахарного тростника, экологичен, так, как изделия из него разлагаются в природных условиях '
                },
            ]
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
                    ru: 'Подходит для моделей',
                    en: 'Good for models'
                }
            },
            {
                url: pla_2,
                name: {
                    ru: 'Изображение 2',
                    en: 'Image 2'
                }
            },
            {
                url: pla_3,
                name: {
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_4,
                name: {
                    ru: 'Изображение 4',
                    en: 'Image 4'
                }
            },
            {
                url: pla_5,
                name: {
                    ru: 'Изображение 5',
                    en: 'Image 5'
                }
            },
            {
                url: pla_6,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
        ],
        features: {
            pros: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием ',
                        en: 'cutting and grinding'
                    }
                },
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
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '4-6 р/гр',
                        en: '4-6 rub/gr'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-20…+45°С',
                        en: '-20…+45°C'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
            ]
        }
    },







//------------------------------------------------------------------------------------------------------
    {
        id: 'f_PETg',
        colors: ["c_b", "c_w", "c_t"],
        name: {
            ru: 'PETg (полиэтилентерефталат, модифицированный гликолем)',
            en: 'PETg (Polyethylene, terephthalate modified with glycol)'
        },
        text: {
            en: [
                {
                    part: 'Indeed, this material is most commonly used for manufacturing technical parts, and it handles heat better than PLA and is not susceptible to sunlight. PETg is available in various colors, with fillings resembling stone, metal, or wood, although, like PLA, it is less commonly encountered.'
                },
            ],
            ru: [
                {
                    part: 'Именно, этот материал чаще всего используют для изготовления технических деталей, лучше, чем PLA переносит нагрев, не боится солнечного света. Выпускается PETg в различных цветах, наполнение под камень, металл или дерево, как в случае с PLA, встречается редко.'
                },
            ]
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
                    ru: 'Изображение 3',
                    en: 'Image 3'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 5',
                    en: 'Image 5'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 2',
                    en: 'Image 2'
                }
            },
            {
                url: pla_1,
                name: {
                    ru: 'Изображение 6',
                    en: 'Image 6'
                }
            },
        ],
        features: {
            pros: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'хорошая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'хорошая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием ',
                        en: 'cutting and grinding'
                    }
                },
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
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-40…+70°С',
                        en: '-40…+70°C'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '4.5-6.5 р/гр',
                        en: '4.5-6.5 rub/gr'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
            ]
        },

    },



//------------------------------------------------------------------------------------------------------

    {
        id: 'f_ABS',
        colors: ["c_b", "c_w", "c_t"],
        name: {
            ru: 'ABS (Акрилонитрил бутадиен стирол)',
            en: 'ABS (Acrylonitrile Butadiene Styrene)'
        },
        text: {
            en: [
                {
                    part: 'Poor meltability and high shrinkage of ABS plastic result in low strength. However, this plastic has good thermal resistance. It is most commonly used for 3D printing interior/exterior parts of automobiles. Without paint or coating, it is susceptible to direct sunlight.'
                },
            ],
            ru: [
                {
                    part: 'Плохая спекаемость и высокая усадка ABS пластика влекут за собой низкую прочность, однако, данный пластик обладает хорошей термостойкостью. Чаще всего из него печатают детали интерьера/экстерьера автомобиля. Без покрытия краской или лаком боится открытых солнечных лучей.'
                },
            ]
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
        features: {
            pros: [
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
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием ',
                        en: 'cutting and grinding'
                    }
                },
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'дихлорметан, дихлорэтан, ацетон',
                        en: 'dichloromethane, dichloroethane,acetone'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-40…+85°С',
                        en: '-40…+85°C'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '4.5-6.5 р/гр',
                        en: '4.5-6.5 rub/gr'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'плохая',
                        en: 'low'
                    }
                },
            ]
        },
        
    },
    










//------------------------------------------------------------------------------------------------------

    {
        id: 'f_ASA',
        colors: ["c_w"],
        name: {
            ru: 'ASA (акрилонитрил стирол акрилат)',
            en: 'ASA (Acrylonitrile Styrene Acrylate)'
        },
        text: {
            en: [
                {
                    part: 'ASA is a relative of ABS plastic and shares the same physical properties as its counterpart. The most significant and only difference between them is that ASA has high weather resistance and, in its uncolored form, is not susceptible to direct sunlight.'
                },
            ],
            ru: [
                {
                    part: 'ASA является родственником ABS пластика, обладает теми же физическими свойствами, что и его собрат. Важнейшее и единственное отличие между ними – ASA обладает высокой атмосферостойкостью, в неокрашенном виде не боится прямых солнечных лучей.'
                },
            ]
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
        features: {
            pros: [
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
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием ',
                        en: 'cutting and grinding'
                    }
                },
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'дихлорметан, дихлорэтан, ацетон',
                        en: 'dichloromethane, dichloroethane,acetone'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-40…+85°С',
                        en: '-40…+85°C'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '6-8 р/гр',
                        en: '6-8 rub/gr'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'ршпр'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'плохая',
                        en: 'low'
                    }
                },
            ]
        },
    },






    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_PA',
        colors: ["c_b"],
        name: {
            ru: 'PA (полиамид/нейлон)',
            en: 'PA (Polyamide/Nylon)'
        },
        text: {
            en: [
                {
                    part: 'Polyamide is resistant to petroleum products and solvents. Due to its low friction, it is particularly well-suited for manufacturing bushings and gears, where lubrication is not necessary. Thanks to its high strength, even in freezing conditions, the parts retain their functionality'
                },
            ],
            ru: [
                {
                    part: 'Полиамид стоек к нефтепродуктам и растворителям, из-за низкого трения он лучше всего подходит для изготовления втулок, шестерен, при этом смазка не обязательна. Из-за высокой прочности, даже, на морозе детали сохраняют работоспособность.'
                },
            ]
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
        features: {
            pros: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-60…+90°С',
                        en: '-60…+90°C'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: '?????',
                        en: '?????'
                    }
                },
                {
                    name: {
                        ru: 'стойкость к растворителям',
                        en: 'solvent resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием, затруднена',
                        en: 'hard to cutting and grinding'
                    }
                },
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'не обрабатывается',
                        en: 'solvent resistance'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: '??????',
                        en: '??????'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '10-15 р/гр',
                        en: '10-15 rub/gr'
                    }
                },
            ]
        },
    },







//------------------------------------------------------------------------------------------------------

{
    id: 'f_CABS',
    colors: ["c_b"],
    name: {
        ru: 'Композиты на основе ABS',
        en: 'Composites based on ABS'
    },
    text: {
        en: [
            {
                part: 'Poor meltability and high shrinkage of ABS plastic result in low strength. However, this plastic has good thermal resistance. It is most commonly used for 3D printing interior/exterior parts of automobiles. Without paint or coating, it is susceptible to direct sunlight. By adding glass and carbon fibers, the strength and stiffness are increased.'
            },
            {
                part: ''
            },
            {
                part: 'Types of fibers: '
            },
            {
                part: 'GF (glass fibers)'
            },
            {
                part: 'CF (carbon fibers)'
            },
        ],
        ru: [
            {
                part: 'Плохая спекаемость и высокая усадка ABS пластика влекут за собой низкую прочность, однако, данный пластик обладает хорошей термостойкостью. Чаще всего из него печатают детали интерьера/экстерьера автомобиля. Без покрытия краской или лаком боится открытых солнечных лучей. Благодаря добавлению стеклянных и углеродных нитей повышается прочность и жёсткость.'
            },
            {
                part: ''
            },
            {
                part: 'Виды нитей: '
            },
            {
                part: 'GF (стеклянные нити)'
            },
            {
                part: 'CF (углеродные нити)'
            },
        ]
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
    features: {
        pros: [
            {
                name: {
                    ru: 'прочность',
                    en: 'hardness'
                },
                value: {
                    ru: 'средняя ????',
                    en: 'medium ????'
                }
            },
            {
                name: {
                    ru: 'жёсткость',
                    en: 'toughness'
                },
                value: {
                    ru: 'высокая ????',
                    en: 'very high ????'
                }
            },
            {
                name: {
                    ru: 'обработка',
                    en: 'processing'
                },
                value: {
                    ru: 'резанием и шлифованием ',
                    en: 'cutting and grinding'
                }
            },
            {
                name: {
                    ru: 'обработка растворителями',
                    en: 'solvent treatment '
                },
                value: {
                    ru: 'дихлорметан, дихлорэтан, ацетон',
                    en: 'dichloromethane, dichloroethane,acetone'
                }
            },
            {
                name: {
                    ru: 'ударостойкость',
                    en: 'impact resistance'
                },
                value: {
                    ru: 'высокая',
                    en: 'high'
                }
            },
            {
                name: {
                    ru: 'температура эксплуатации',
                    en: 'expluatation tempreture'
                },
                value: {
                    ru: '-40…+85°С',
                    en: '-40…+85°C'
                }
            },
            {
                name: {
                    ru: 'средняя стоимость',
                    en: 'average price'
                },
                value: {
                    ru: '4.5-6.5 р/гр',
                    en: '4.5-6.5 rub/gr'
                }
            },
        ],
        cons: [
            {
                name: {
                    ru: 'усадка',
                    en: 'shrinkage'
                },
                value: {
                    ru: 'высокая',
                    en: 'high'
                }
            },
            {
                name: {
                    ru: 'УФ стойкость (Солнце)',
                    en: 'ultraviolet resistance (Sun)'
                },
                value: {
                    ru: 'низкая',
                    en: 'low'
                }
            },
            {
                name: {
                    ru: 'износостойкость',
                    en: 'durability'
                },
                value: {
                    ru: 'низкая',
                    en: 'low'
                }
            },
            {
                name: {
                    ru: 'спекаемость',
                    en: 'sinterability'
                },
                value: {
                    ru: 'плохая',
                    en: 'low'
                }
            },
        ]
    },
    
},












        
    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_CN',
        colors: ["c_b"],
        name: {
            ru: 'Композиты на основе нейлона',
            en: 'Composites based on nylon'
        },
        text: {
            en: [
                {
                    part: 'Polyamide is resistant to petroleum products and solvents. Due to its low friction, it is particularly well-suited for manufacturing bushings and gears, where lubrication is not necessary. Thanks to its high strength, even in freezing conditions, the parts retain their functionality. By adding glass and carbon fibers, the strength and stiffness are increased.'
                },
                {
                    part: ''
                },
                {
                    part: 'Types of fibers: '
                },
                {
                    part: 'GF (glass fibers)'
                },
                {
                    part: 'CF (carbon fibers)'
                },
            ],
            ru: [
                {
                    part: 'Полиамид стоек к нефтепродуктам и растворителям, из-за низкого трения он лучше всего подходит для изготовления втулок, шестерен, при этом смазка не обязательна. Из-за высокой прочности, даже, на морозе детали сохраняют работоспособность. Благодаря добавлению стеклянных и углеродных нитей повышается прочность и жёсткость.'
                },
                {
                    part: ''
                },
                {
                    part: 'Виды нитей: '
                },
                {
                    part: 'GF (стеклянные нити)'
                },
                {
                    part: 'CF (углеродные нити)'
                },
            ]
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
        features: {
            pros: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'очень высокая ????',
                        en: 'very high ????'
                    }
                },
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'средняя ????',
                        en: 'medium ????'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-60…+90°С',
                        en: '-60…+90°C'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: '?????',
                        en: '?????'
                    }
                },
                {
                    name: {
                        ru: 'стойкость к растворителям',
                        en: 'solvent resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием, затруднена',
                        en: 'hard to cutting and grinding'
                    }
                },
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'не обрабатывается',
                        en: 'solvent resistance'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: '??????',
                        en: '??????'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '10-15 р/гр',
                        en: '10-15 rub/gr'
                    }
                },
            ]
        },
    },








    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_PC',
        colors: ["c_b", 'c_m', 'c_w', 'c_r', "c_b", "c_g"],
        name: {
            ru: 'PC (поликарбонат)',
            en: 'PC (Polycarbonate)'
        },
        text: {
            en: [
                {
                    part: 'Polycarbonate stands out among materials with its wide range of operating temperatures and high wear resistance. It is non-combustible.'
                },
            ],
            ru: [
                {
                    part: 'Поликарбонат из спектра материалов выделяется широким диапазоном рабочих температур и высокой износостойкостью. Не поддерживает горение.'
                },
            ]
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
        features: {
            pros: [
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
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-100…+110°С',
                        en: '-100…+110°C'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием',
                        en: 'cutting and grinding'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: '?????',
                        en: '?????'
                    }
                },
                {
                    name: {
                        ru: 'стойкость к растворителям',
                        en: 'solvent resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
            ],
            cons: [

                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'не обрабатывается',
                        en: 'solvent resistance'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'плохая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '????? р/гр',
                        en: '????? rub/gr'
                    }
                },
            ]
        },
    },


















    

    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_PP',
        colors: ["c_b", 'c_m', 'c_w', 'c_r', "c_b", "c_g"],
        name: {
            ru: 'PP (полипропилен)',
            en: 'PP (polypropylene)'
        },
        text: {
            en: [
                {
                    part: 'Polypropylene possesses high fatigue strength, and parts made from it can withstand multiple flexural cycles.'
                },
            ],
            ru: [
                {
                    part: 'Полипропилен обладает высокой усталостной прочностью, детали, изготовленные из него выдерживают многократные изгибы.'
                },
            ]
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
        features: {
            pros: [
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
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'очень высокая',
                        en: 'very high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-20…+120°С',
                        en: '-20…+120°C'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием и шлифованием',
                        en: 'cutting and grinding'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: '?????',
                        en: '?????'
                    }
                },
                {
                    name: {
                        ru: 'стойкость к растворителям',
                        en: 'solvent resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
            ],
            cons: [

                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'не обрабатывается',
                        en: 'solvent resistance'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },

                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '????? р/гр',
                        en: '????? rub/gr'
                    }
                },
            ]
        },
    },









    
    

    //------------------------------------------------------------------------------------------------------

    {
        id: 'f_SEBS',
        colors: ["c_b", 'c_m', 'c_w', 'c_r', "c_b", "c_g"],
        name: {
            ru: 'SEBS (стирол этилен бутадиен стирол)',
            en: 'SEBS (Styrene Ethylene Butadiene Styrene)'
        },
        text: {
            en: [
                {
                    part: 'Thermoplastic elastomer, similar to rubber in physical properties, is often used in modeling for the production of tires, tracks, and damping pads.'
                },
            ],
            ru: [
                {
                    part: 'Термопластичный эластомер, по физическим свойствам похож на резину, а потому в моделировании его часто применяют для изготовления шин и гусениц, демпфирующих прокладок.'
                },
            ]
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
        features: {
            pros: [
                {
                    name: {
                        ru: 'спекаемость',
                        en: 'sinterability'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
                {
                    name: {
                        ru: 'гибкость',
                        en: 'suppleness'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
                {
                    name: {
                        ru: 'жёсткость',
                        en: 'toughness'
                    },
                    value: {
                        ru: '????',
                        en: '????'
                    }
                },
                {
                    name: {
                        ru: 'ударостойкость',
                        en: 'impact resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'износостойкость',
                        en: 'durability'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'high'
                    }
                },
                {
                    name: {
                        ru: 'температура эксплуатации',
                        en: 'expluatation tempreture'
                    },
                    value: {
                        ru: '-35…+85°С',
                        en: '-35…+85°C'
                    }
                },
                {
                    name: {
                        ru: 'усадка',
                        en: 'shrinkage'
                    },
                    value: {
                        ru: 'средняя',
                        en: 'medium'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'резанием',
                        en: 'cutting'
                    }
                },
                {
                    name: {
                        ru: 'УФ стойкость (Солнце)',
                        en: 'ultraviolet resistance (Sun)'
                    },
                    value: {
                        ru: '?????',
                        en: '?????'
                    }
                },
                {
                    name: {
                        ru: 'стойкость к растворителям',
                        en: 'solvent resistance'
                    },
                    value: {
                        ru: 'высокая',
                        en: 'very high'
                    }
                },
            ],
            cons: [
                {
                    name: {
                        ru: 'прочность',
                        en: 'hardness'
                    },
                    value: {
                        ru: 'низкая',
                        en: 'low'
                    }
                },
                {
                    name: {
                        ru: 'обработка растворителями',
                        en: 'solvent treatment '
                    },
                    value: {
                        ru: 'не обрабатывается',
                        en: 'solvent resistance'
                    }
                },
                {
                    name: {
                        ru: 'обработка',
                        en: 'processing'
                    },
                    value: {
                        ru: 'шлифованием затруднена',
                        en: 'hard to grinding'
                    }
                },
                {
                    name: {
                        ru: 'средняя стоимость',
                        en: 'average price'
                    },
                    value: {
                        ru: '????? р/гр',
                        en: '????? rub/gr'
                    }
                },
            ]
        },
    },


] satisfies Array<IFiber>

export default mockFibers