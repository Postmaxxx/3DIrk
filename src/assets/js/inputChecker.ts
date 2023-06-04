import { ICheckErrorItem, TLangText } from "src/interfaces"


//{ref: _name, name: {en: 'Your name', ru: 'Ваше имя'}}, //receive format

const inputChecker = (feildsToCheck: ICheckErrorItem[]) => {
    let isWrong: boolean = false
    const header = {en: 'Errors found', ru: 'Обнаружены ошибки'}
    const errors: TLangText[] = []
    feildsToCheck.forEach(field => {
        if (!field.ref.current?.checkValidity()) {
            errors.push({en: `Field "${field.name.en}" is incorrect`, ru: `Поле "${field.name.ru}" заполнено неверно`})
            field.ref.current?.parentElement?.classList.add('error')
            isWrong = true
        }
    })
    return {isWrong, header, errors}
}

export default inputChecker