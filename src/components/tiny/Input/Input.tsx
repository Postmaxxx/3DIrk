import { TLang } from "src/interfaces"


interface IInput {
    id: string
    type: string
    required: boolean
    min: number
    max: number
    lang: TLang
    ref: HTMLInputElement
    onChange: () => void
    toNext: () => void
}

const Input: React.FC<IInput> = ({id, lang}): JSX.Element => {

    const onChangeText = (e: React.FormEvent<HTMLInputElement>) => {
        (e.target as HTMLElement).parentElement?.classList.remove('error')
    }


    const focusNext = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div className="input-block">
            {/*<label htmlFor="name">
                {lang === 'en' ? 'Your name' : 'Ваше имя'}
            </label>
            <input 
                className="input-element" 
                id="name" 
                type="text" 
                required 
                min={2} 
                max={25} 
                ref={_name} 
                onChange={onChangeText} 
    onKeyDown={(e: KeyboardEvent) => focusNext(e)}/>*/}
        </div>
    )
}


export default Input