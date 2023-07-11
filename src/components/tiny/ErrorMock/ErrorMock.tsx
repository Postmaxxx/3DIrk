import { TLang, TLangText } from "../../../interfaces"

interface IProps {
    lang: TLang
    comp: TLangText
}

const ErrorMock = ({lang, comp}: IProps) => {
    return (
        <p>{lang === 'en' ? `Error occured while loading ${comp.en}` : `Произошла ошибка при загрузке ${comp.ru}`}</p>
    )
}

export default ErrorMock