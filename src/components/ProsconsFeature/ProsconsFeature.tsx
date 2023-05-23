import { IFeature, TLang, TLangText } from 'src/interfaces'
import './proscons-feature.scss'

interface IProps {  
    pros: IFeature[]
    cons: IFeature[]
    lang: TLang
}

const ProsconsFeature = ({pros, cons, lang} : IProps) => {
    return (
        <div className="proscons__container proscons_feature__container">
            <ul className='pros'>
                {pros.length > 0 ? pros.map((item,i) => <li key={i}>
                    {item.name[lang]}: {item.value[lang]}
                    </li>) : null}
            </ul>
            <ul className='cons'>
                {cons.length > 0 ? cons.map((item,i) => <li key={i}>{item.name[lang]}: {item.value[lang]}</li>) : null}
            </ul>

        </div>
    )
}

export default ProsconsFeature