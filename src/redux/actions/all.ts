import * as actionsListFibers from "./fibers"
import * as actionsListColors from "./colors"
import * as actionsListCart from "./cart"
import * as actionsListUser from "./user"
import * as actionsListCatalog from "./catalog"
import * as actionsListNews from "./news"
import * as actionsListOrder from "./order"
import * as actionsListProduct from "./product"
import * as actionsListBase from "./base"


const allActions = {
    fibers: {...actionsListFibers},
    colors: {...actionsListColors},
    cart: {...actionsListCart},
    user: {...actionsListUser},
    catalog: {...actionsListCatalog},
    news: {...actionsListNews},
    order: {...actionsListOrder},
    product: {...actionsListProduct},
    base: {...actionsListBase}
}

export { allActions }