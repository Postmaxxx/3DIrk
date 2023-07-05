import './orders.scss'
import { allActions } from "src/redux/actions/all";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IColorsState, IFetch, IFibersState, IFilterUser, IFullState, IOrdersState, IUserState, TLang, TLangText } from 'src/interfaces';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { gapBetweenRequests } from 'src/assets/js/consts';
import moment from "moment";
import Preloader from 'src/components/Preloaders/Preloader';



interface IPropsState {
    lang: TLang,
    colorsState: IColorsState
    fibersState: IFibersState
    userState: IUserState
    ordersState: IOrdersState
}

interface IPropsActions {
    setState: {
        user: typeof allActions.user
        fibers: typeof allActions.fibers
        colors: typeof allActions.colors
        catalog: typeof allActions.catalog
        orders: typeof allActions.orders
    }
}

interface IProps extends IPropsState, IPropsActions {}



const Orders = ({lang, colorsState, fibersState, ordersState, userState, setState}: IProps): JSX.Element => {
    const _dateFrom = useRef<HTMLInputElement>(null)
    const _dateTo = useRef<HTMLInputElement>(null)
    const _user = useRef<HTMLSelectElement>(null)
    const _status = useRef<HTMLSelectElement>(null)
    
    const [loaded, setLoaded] = useState<boolean>(false)



    useEffect(() => { //initial load data
        if (userState.auth.status !== 'success') return //!!!

        if (colorsState.load.status === 'idle') {
            setState.colors.loadColors()
        }
        if (colorsState.load.status === 'error') { //!!!
            setTimeout(() => setState.colors.loadColors(), gapBetweenRequests)
        }
        
        if (ordersState.userList.load.status === 'idle') {
            setState.orders.loadUsers()
        }
        if (ordersState.userList.load.status === 'error') {            
            setTimeout(() => {setState.orders.loadUsers()}, gapBetweenRequests)
        }

        if (colorsState.load.status === 'success' && fibersState.load.status === 'success') {
            setLoaded(true)
            if (!_user.current || !_dateFrom.current || !_dateTo.current) return
            _dateFrom.current.value = moment().format('YYYY-MM-DD')
            _dateTo.current.value = moment().format('YYYY-MM-DD')
        }
    }, [colorsState.load, fibersState.load, ordersState.userList.load, userState.auth.status])



    const loadOrders = () => {
        if (!_user.current || !_dateFrom.current || !_dateTo.current || !_status.current) return
        if (!_dateFrom.current.value) {
            return alert('Wrong date from')
        }
        if (!_dateTo.current.value) {
            return alert('Wrong date to')
        }    
        const dateFrom: string = _dateFrom.current.value
        const dateTo: string = _dateTo.current.value
        setState.orders.loadOrders({userId: _user.current.value, status: _status.current.value, from: dateFrom, to: dateTo})
    }


    return (
        <div className="page_orders">
            <div className='container_page'>
                <div className="container">
                    {userState.isAdmin ? 
                        <h1>{lang === 'en' ? 'All orders' : 'Все заказы'}</h1>
                    :
                        <h1>{lang === 'en' ? 'All your orders' : 'Все ваши заказы'}</h1>
                    }
                    {loaded && 
                    <>
                        <div className="filters">
                            <div className="filter__item">
                                <label htmlFor="user">Select user
                                    <select name="user" id="user" ref={_user}>
                                        <option value="all" defaultValue='all'>All</option>
                                        {ordersState.userList.list.map(item => (
                                            <option key={item._id} value={item._id}>{item.name} - {item.email}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="filter__item">
                                <label htmlFor="status">Select status
                                    <select name="status" id="status" ref={_status}>
                                        <option value="all" defaultValue='all'>All</option>
                                        <option value='new'>New</option>
                                        <option value='working'>In progress</option>
                                        <option value='fonished'>Finished</option>
                                        <option value='canceled'>Canceled</option>
                                    </select>
                                </label>
                            </div>
                            <div className="filter__item">
                                <label htmlFor="date-from">Date from 
                                    <input type="date" id='date-from' ref={_dateFrom}/>
                                </label>
                            </div>
                            <div className="filter__item">
                                <label htmlFor="date-to">Date to 
                                    <input type="date" id='date-to' ref={_dateTo}/>
                                </label>
                            </div>
                            <button className='button_blue' onClick={loadOrders}>Load Orders</button>
                        </div>
                        <div className="orders__container">
                            {ordersState.users.map((user) => {
                                return (
                                    <div className="block_user" key={user.info._id}>
                                        <h3 className='user__header'>{user.info.name}</h3>
                                        <span className='user__subheader'>
                                            <a href={`mailto: ${user.info.email}`} type="email">{user.info.email}</a> / 
                                            <a href={`tel: ${user.info.phone}`} type="email"> {user.info.phone}</a>
                                        </span>
                                        <div className="block_order">

                                            {user.orders.map((order) => {
                                                return (
                                                    <>
                                                        <div className='order__date-status'>
                                                            <h4>Date: {order.date}</h4>
                                                            <label>Status: 
                                                                <select name="" defaultValue={order.status}>
                                                                    <option value="working">In progress</option>
                                                                    <option value="new">New</option>
                                                                    <option value="finished">Finished</option>
                                                                    <option value="canceled">Canceled</option>
                                                                </select>
                                                            </label>
                                                        </div>

                                                        <div className="order__cart">
                                                            <div className="cell head first">Product</div>
                                                            <div className="cell head">Fiber</div>
                                                            <div className="cell head">Color</div>
                                                            <div className="cell head">Type</div>
                                                            <div className="cell head">Amount</div>
                                                            
                                                            {order.cart.map((cartItem) => {
                                                                return (
                                                                    <>
                                                                        <div className="cell first">{cartItem.productName[lang]}</div>
                                                                        <div className="cell">{cartItem.fiberName[lang]}</div>
                                                                        <div className="cell">{cartItem.colorName[lang]}</div>
                                                                        <div className="cell">{cartItem.type[lang]}</div>
                                                                        <div className="cell center">{cartItem.amount}</div>
                                                                    </>
                                                                )
                                                            })}

                                                        </div>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>}
                    {ordersState.load.status === 'fetching' && <Preloader />}
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    userState: state.user,
    colorsState: state.colors,
    fibersState: state.fibers,
    ordersState: state.orders
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>):IPropsActions => ({
    setState: {
		fibers: bindActionCreators(allActions.fibers, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		catalog: bindActionCreators(allActions.catalog, dispatch),
		user: bindActionCreators(allActions.user, dispatch),
		orders: bindActionCreators(allActions.orders, dispatch),
	}
})
  
  
    
export default connect(mapStateToProps, mapDispatchToProps)(Orders)
