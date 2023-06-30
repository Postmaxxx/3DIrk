import * as actionsListFibers from "./fibers"
import * as actionsListColors from "./colors"
import * as actionsListUser from "./user"
import * as actionsListCatalog from "./catalog"
import * as actionsListNews from "./news"
import * as actionsListOrder from "./order"
//import * as actionsListProduct from "./product"
import * as actionsListBase from "./base"
import * as actionsListContent from "./content"


const allActions = {
    fibers: {...actionsListFibers},
    colors: {...actionsListColors},
    user: {...actionsListUser},
    catalog: {...actionsListCatalog},
    news: {...actionsListNews},
    order: {...actionsListOrder},
    base: {...actionsListBase},
    content: {...actionsListContent}
}

export { allActions }