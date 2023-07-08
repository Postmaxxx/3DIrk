import { resetFetch } from "src/assets/js/consts"
import { IContentState } from "src/interfaces"

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