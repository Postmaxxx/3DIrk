import { TLangText } from "src/interfaces";

export const msgDecoder = (error: string): TLangText => {
    switch (error) {
        case 'ru0':
            return {en: 'Errors in data during registration', ru: 'Ошибки в данных при регистрации'}
            break;
        case 'ru1':
            return {en: 'User already exists', ru: 'Такой пользователь уже существует'}
            break;   
        case 'ru2':
            return {en: 'User created', ru: 'Пользователь создан'}
            break;  
        case 'ru3':
            return {en: 'Something wrong with server, try again later', ru: 'Ошибка на сервере, попробуйте позже'}
            break;    
        default:
            return {en: 'Unknown code', ru: 'Неизвестный код'}
            break;
    }
}