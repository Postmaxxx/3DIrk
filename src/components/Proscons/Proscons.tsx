import { TLang, TLangTextArr } from 'src/interfaces'
import './proscons.scss'

interface IProps {  
    pros: TLangTextArr
    cons: TLangTextArr
    lang: TLang
}

const Proscons = ({pros, cons, lang} : IProps) => {
    
    return (
        <div className="proscons">
            <ul className='pros'>
                {pros[lang].map((item,i) => <li key={i}>{item.part}</li> )}
            </ul>
            <ul className='cons'>
                {cons[lang].map((item,i) => <li key={i}>{item.part}</li> )}
            </ul>

        </div>
    )
}

export default Proscons