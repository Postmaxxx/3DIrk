import './orders.scss'
import { allActions } from "../../redux/actions/all";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IFetch, IFullState, IOrdersItem, IOrdersState, OrderType, TLang } from '../../interfaces';
import {Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gapForOrders, orderStatus, timeOffset, usersPerPage } from '../../assets/js/consts';
import moment from "moment";
import Preloader from '../../components/Preloaders/Preloader';
import { checkAndLoad } from '../../assets/js/processors';
import { NavLink } from 'react-router-dom';



interface IPropsState {
    lang: TLang,
    colorsLoad: IFetch
    fibersLoad: IFetch
    isAdmin: boolean
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


const Orders: React.FC<IProps> = ({lang, colorsLoad, fibersLoad, ordersState, isAdmin, setState}): JSX.Element => {
    const _dateFrom = useRef<HTMLInputElement>(null)
    const _dateTo = useRef<HTMLInputElement>(null)
    const _user = useRef<HTMLSelectElement>(null)
    const _status = useRef<HTMLSelectElement>(null)
    const [page, setPage] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<string[]>([])

    const [loaded, setLoaded] = useState<boolean>(false)


    useEffect(() => {
        setTotalPages(new Array(Math.ceil(ordersState.users.length / usersPerPage) || 1).fill('')?.map((item, i) => String(i+1)))
        setPage(0)
    }, [ordersState.users])


    useEffect(() => { //initial load data
        checkAndLoad({
			fetchData: colorsLoad,
			loadFunc: setState.colors.loadColors,
			force: false
		})
        checkAndLoad({
			fetchData: ordersState.userList.load,
			loadFunc: setState.orders.loadUsers,
			force: false
		})

        if (colorsLoad.status === 'success' && fibersLoad.status === 'success') {
            setLoaded(true)
            if (!_user.current || !_dateFrom.current || !_dateTo.current) return
            _dateFrom.current.value = moment().subtract(gapForOrders, 'months').format('YYYY-MM-DD')
            _dateTo.current.value = moment().format('YYYY-MM-DD')
        }
    }, [colorsLoad.status, fibersLoad.status, ordersState.userList.load.status, loaded])


    const loadOrders = (): void => {
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

        checkAndLoad({
			fetchData: ordersState.load,
			loadFunc: setState.orders.loadOrders,
            args: [{userId: _user.current.value, status: _status.current.value, from: dateTimeFrom, to: dateTimeTo}],
            force: true
		})
    }


    interface IOnStatusChange {
        e: React.ChangeEvent<HTMLSelectElement> 
        orderId: string
    }

    const onStatusChange = ({e, orderId}: IOnStatusChange): void => {
        setState.orders.changeOrderStatus(orderId, e.target.value as OrderType)
    }



    const orderCart = (order: IOrdersItem) => {
        return order.cart.map((cartItem, i) => (
            <Fragment key={i}>
                <div className="cell first">
                    <NavLink to={`../catalog/${cartItem.productId}`}>
                        {cartItem.productName[lang]}
                    </NavLink>
                </div>
                <div className="cell">{cartItem.fiberName[lang]}</div>
                <div className="cell">{cartItem.colorName[lang]}</div>
                <div className="cell">{cartItem.type[lang]}</div>
                <div className="cell center">{cartItem.amount}</div>
            </Fragment>
        ))
    }


    const filesList = (order: IOrdersItem) => {
        return (
            order.attachedFiles.map(file => (
                <div className="cell" key={file}>
                    <a download href={`${order.pathToFiles}/${file}`}>{file}</a>
                </div>)
            )
        )
    }


    const statuses = useMemo(() => {
        return orderStatus.map(status => <option key={status.name[lang]} value={status.value}>{status.name[lang]}</option>)
    }, [lang])


    const userTable = ordersState.users
        .filter((user, i) => (i >= page*usersPerPage && i < (page+1)*usersPerPage))
        ?.map((user, i: number) => {
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
                                        <h4>{lang === 'en' ? 'Date' : 'Дата'}: {moment(order.date).add(-timeOffset, 'hours').format('YYYY-MM-DD')}</h4>
                                        <label>{lang === 'en' ? 'Status' : 'Статус'}: 
                                            <select 
                                                name="statusSelector" 
                                                defaultValue={order.status} 
                                                onChange={(e) => {onStatusChange({e, 
                                                orderId: order._id})}}
                                            >
                                                {statuses}
                                            </select>
                                        </label>
                                    </div>
        
                                    <div className="order__cart">
                                        <div className="cell head first">{lang === 'en' ? 'Product' : 'Продукт'}</div>
                                        <div className="cell head">{lang === 'en' ? 'Fiber' : 'Материал'}</div>
                                        <div className="cell head">{lang === 'en' ? 'Color' : 'Цвет'}</div>
                                        <div className="cell head">{lang === 'en' ? 'Type' : 'Тип'}</div>
                                        <div className="cell head">{lang === 'en' ? 'Amount' : 'Кол-во'}</div>
                                        {orderCart(order)}
                                    </div>

                                    {order.message.length > 0 &&
                                        <div className="order__message-container">
                                            <p className='order__message'>{lang === 'en' ? "Message" : "Сообщение"}: {order.message}</p>
                                        </div>}
                                    {order.attachedFiles.length > 0 &&
                                        <>
                                            <h4 className='files__header'>{lang === 'en' ? "Attached files" : "Прикрепленные файлы"}</h4>
                                            <div className="files-container">
                                                {filesList(order)}
                                            </div>
                                        </>
                                    }
        
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        })



    const userList = useMemo(() => {
        return (
            ordersState.userList.list?.map(item => (
                <option key={item._id} value={item._id}>{item.name} - {item.email}</option>
            ))
        )
    }, [ordersState.userList.list])


    const pagesList = useMemo(() => totalPages.map((item, i) => {
        return <button 
            className={`pagination__page-number ${i === page ? 'selected' : ''}`} 
            key={item} 
            onClick={(e) => setPage(i)}>
                {item}
            </button>
    }), [page, totalPages])
    


    

    return (
        <div className="page_orders">
            <div className='container_page'>
                <div className="container">
                    <h1>{lang === 'en' ? `All orders` : `Все заказы`}</h1>
                    {loaded &&  <>
                        <div className="filters">
                            <div className={`filter__item ${isAdmin ? '' : 'hidden'}`}>
                                <label htmlFor="user">{lang === 'en' ? 'Select user' : 'Выберите пользователя'}
                                    <select name="user" id="user" ref={_user}>
                                        {isAdmin  && <option value="all" defaultValue='all'>{lang === 'en' ? 'All' : 'Все'}</option>}
                                        {userList}
                                    </select>
                                </label>
                            </div>
                            <div className="filter__item">
                                <label htmlFor="status">{lang === 'en' ? 'Select status' : 'Выберите статус'}
                                    <select name="status" id="status" ref={_status}>
                                        <option value="all" defaultValue='all'>{lang === 'en' ? 'All' : 'Все'}</option>
                                        {statuses}
                                    </select>
                                </label>
                            </div>
                            <div className="filter__item">
                                <label htmlFor="date-from">{lang === 'en' ? 'Date from' : 'С даты'}
                                    <input type="date" id='date-from' ref={_dateFrom}/>
                                </label>
                            </div>
                            <div className="filter__item">
                                <label htmlFor="date-to">{lang === 'en' ? 'Date to' : 'По дату'}
                                    <input type="date" id='date-to' ref={_dateTo}/>
                                </label>
                            </div>
                            <button className='button_blue' onClick={loadOrders}>{lang === 'en' ? 'Load orders' : 'Загрузить заказы'}</button>
                        </div>
                        <div className="orders__container">
                            {ordersState.users.length > 0 && ordersState.load.status ==='success' ? 
                                userTable 
                             : 
                                ordersState.load.status === 'success' && <span className="empty-informer">{lang === 'en' ? 'Nothing has been found' : 'Ничего не найдено'}</span>
                            }
                            <div className="pagination__container">
                                {pagesList}
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
    isAdmin: state.user.isAdmin,
    colorsLoad: state.colors.load,
    fibersLoad: state.fibers.load,
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
