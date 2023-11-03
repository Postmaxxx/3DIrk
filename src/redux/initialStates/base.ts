import { IModalFunctions } from "src/components/Modal/ModalNew"
import { IBaseState } from "../../interfaces"
import {RefObject} from 'react'

const initialBase = {
    theme: 'dark',
    lang: 'en',
    modal: {} as RefObject<IModalFunctions>
} satisfies IBaseState

export default initialBase