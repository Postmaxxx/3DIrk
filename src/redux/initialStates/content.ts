import { resetFetch } from "../../assets/js/consts"
import { IContentState } from "../../interfaces"

const initialContentState = {
    send: resetFetch,
    load: resetFetch,
    carousel: {
        images: {
            files: [],
            sizes: [],
            basePath: ''
        }
    }
} satisfies IContentState

export default initialContentState