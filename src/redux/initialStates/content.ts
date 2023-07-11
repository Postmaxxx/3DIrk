import { resetFetch } from "../../assets/js/consts"
import { IContentState } from "../../interfaces"

const initialContentState = {
    send: resetFetch,
    load: resetFetch,
    splider: {
        paths: {
            full: '',
            spliderMain: ''
        },
        files: []
    }
} satisfies IContentState

export default initialContentState