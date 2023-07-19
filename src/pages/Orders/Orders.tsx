import './orders.scss'
import { allActions } from "../../redux/actions/all";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IColorsState, IFibersState, IFullState, IOrdersState, IUserState, OrderType, TLang } from '../../interfaces';
import {Fragment, useEffect, useRef, useState } from 'react'
import { orderStatus, timeOffset, usersPerPage } from '../../assets/js/consts';
import moment from "moment";
import Preloader from '../../components/Preloaders/Preloader';
import { checkAndLoad } from '../../assets/js/processors';



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
    const [page, setPage] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<string[]>([])

    const [loaded, setLoaded] = useState<boolean>(false)


    useEffect(() => {
        setTotalPages(new Array(Math.ceil(ordersState.users.length / usersPerPage)).fill('').map((item, i) => String(i+1)))
        setPage(0)
    }, [ordersState.users])


    useEffect(() => { //initial load data
        if (userState.auth.status !== 'success') return //!!!

        checkAndLoad(colorsState.load.status, setState.colors.loadColors)
        checkAndLoad(ordersState.userList.load.status, setState.orders.loadUsers)

        if (colorsState.load.status === 'success' && fibersState.load.status === 'success') {
            setLoaded(true)
            if (!_user.current || !_dateFrom.current || !_dateTo.current) return
            _dateFrom.current.value = moment().subtract(1, 'months').format('YYYY-MM-DD')
            _dateTo.current.value = moment().format('YYYY-MM-DD')
        }
    }, [colorsState.load, fibersState.load, ordersState.userList.load, userState.auth.status, loaded])


    const loadOrders = () => {
        if (!_user.current || !_dateFrom.current || !_dateTo.current || !_status.current) return
        if (!_dateFrom.current.value) {
            return alert('Wrong date from')
        }
        if (!_dateTo.current.value) {
            return alert('Wrong date to')
        }    

        const dateFrom: string = new Date(_dateFrom.current.value).toISOString()
        const dateTo: string = moment(_dateTo.current.value).add(1, 'day').format("YYYY-MM-DDT00:00:00.000") + "Z";
        

        const dateTimeFrom = moment(dateFrom).add(timeOffset, 'hours').toISOString();
        const dateTimeTo = moment(dateTo).add(timeOffset, 'hours').toISOString();
        
        setState.orders.loadOrders({userId: _user.current.value, status: _status.current.value, from: dateTimeFrom, to: dateTimeTo})
    }


    interface IOnStatusChange {
        e: React.ChangeEvent<HTMLSelectElement> 
        orderId: string
    }

    const onStatusChange = ({e, orderId}: IOnStatusChange) => {
        setState.orders.changeOrderStatus(orderId, e.target.value as OrderType)
    }


    const onPageClick = (pageNumber: number) => {
        setPage(pageNumber)
    }
   

    const userTable = ordersState.users.map((user, i: number) => {
        if (i >= page*usersPerPage && i < (page+1)*usersPerPage) {
            return (
                <div className="block_user" key={user.userInfo._id}>
                    <h3 className='user__header'>{user.userInfo.name}</h3>
                    <span className='user__subheader'>
                        <a href={`mailto: ${user.userInfo.email}`} type="email">{user.userInfo.email}</a> / 
                        <a href={`tel: ${user.userInfo.phone}`} type="email"> {user.userInfo.phone}</a>
                    </span>
                    <div className="orders">
                        {user.orders.map((order) => {
                            return (
                                <div className='order' key={order._id}>
                                    <div className='order__date-status'>
                                        <h4>Date: {moment(order.date).add(-timeOffset, 'hours').format('YYYY-MM-DD')}</h4>
                                        <label>Status: 
                                            <select name="" defaultValue={order.status} onChange={(e) => {onStatusChange({e, orderId: order._id})}}>
                                                {orderStatus.map(status => {
                                                    return <option key={status.name} value={status.value}>{status.name}</option>
                                                })}
                                            </select>
                                        </label>
                                    </div>
    
                                    <div className="order__cart">
                                        <div className="cell head first">Product</div>
                                        <div className="cell head">Fiber</div>
                                        <div className="cell head">Color</div>
                                        <div className="cell head">Type</div>
                                        <div className="cell head">Amount</div>
                                        
                                        {order.cart.map((cartItem, i) => {
                                            return (
                                                <Fragment key={i}>
                                                    <div className="cell first">{cartItem.productName[lang]}</div>
                                                    <div className="cell">{cartItem.fiberName[lang]}</div>
                                                    <div className="cell">{cartItem.colorName[lang]}</div>
                                                    <div className="cell">{cartItem.type[lang]}</div>
                                                    <div className="cell center">{cartItem.amount}</div>
                                                </Fragment>
                                            )
                                        })}
    
                                    </div>

                                    {order.message.length > 0 &&
                                        <div className="order__message-container">
                                            <p className='order__message'>Message: {order.message}</p>
                                        </div>}
                                    {order.attachedFiles.length > 0 &&
                                        <>
                                            <h4 className='files__header'>attached files</h4>
                                            <div className="files-container">
                                                {order.attachedFiles.map(file => {
                                                    return (
                                                        <div className="cell" key={file}>
                                                            <a download href={`${order.pathToFiles}/${file}`}>{file}</a>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    }
    
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
    })

    return (
        <div className="page_orders">
            <div className='container_page'>
                <div className="container">
                    {userState.isAdmin ? 
                        <h1>{lang === 'en' ? 'All orders' : 'Все заказы'}</h1>
                    :
                        <h1>{lang === 'en' ? 'All your orders' : 'Все ваши заказы'}</h1>
                    }
                    {loaded &&  <>
                        <div className="filters">
                            <div className={`filter__item ${userState.isAdmin ? null : 'hidden'}`}>
                                <label htmlFor="user">Select user
                                    <select name="user" id="user" ref={_user}>
                                        {userState.isAdmin  && <option value="all" defaultValue='all'>All</option>}
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
                                        {orderStatus.map(status => {
                                            return <option key={status.name} value={status.value}>{status.name}</option>
                                        })}
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
                            <button className='button_blue' onClick={loadOrders} disabled={ordersState.load.status === 'fetching'}>Load Orders</button>
                        </div>
                        <div className="orders__container">
                            {ordersState.users.length > 0 && ordersState.load.status ==='success' ? 
                                userTable 
                             : 
                                ordersState.load.status === 'success' && <span className="empty-informer">Nothing found</span>
                            }
                            <div className="pagination__container">
                                {totalPages.map((item, i) => {
                                    return <button className={`pagination__page-number ${i === page ? 'selected' : null}`} key={item} onClick={(e) => onPageClick(i)}>{item}</button>
                                })}
                            </div>
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
