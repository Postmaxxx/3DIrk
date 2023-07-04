import './orders.scss'
import { allActions } from "src/redux/actions/all";
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IColorsState, IFetch, IFibersState, IFilterUser, IFullState, IOrdersState, IUserState, TLang, TLangText } from 'src/interfaces';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { gapBetweenRequests } from 'src/assets/js/consts';



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
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => { //initial load data
        if (colorsState.load.status === 'idle') {
            setState.colors.loadColors()
        }
        if (colorsState.load.status === 'error') {
            setTimeout(() => setState.colors.loadColors(), gapBetweenRequests)
        }
        
        if (ordersState.load.status === 'idle') {
            if (!_user.current || !_dateFrom.current || !_dateTo.current) return
            _dateFrom.current.value = (new Date).toISOString().slice(0, 10)
            _dateTo.current.value = (new Date).toISOString().slice(0, 10)
            setState.orders.loadOrders({userId: _user.current.value, from: _dateFrom.current.value, to:_dateTo.current.value})
        }
        if (ordersState.load.status === 'error') {
            console.log(ordersState.load.status);
            
            setTimeout(() => {
                if (!_user.current || !_dateFrom.current || !_dateTo.current) return
                _dateFrom.current.value = (new Date).toISOString().slice(0, 10)
                _dateTo.current.value = (new Date).toISOString().slice(0, 10)
                setState.orders.loadOrders({userId: _user.current.value, from: _dateFrom.current.value, to:_dateTo.current.value})
            }, gapBetweenRequests)
        }

        if (colorsState.load.status === 'success' && fibersState.load.status === 'success' && ordersState.load.status === 'success') {
            setLoaded(true)
        }
    }, [colorsState.load, fibersState.load, ordersState.load])



    const loadOrders = () => {
        if (!_user.current || !_dateFrom.current || !_dateTo.current) return
        if (!_dateFrom.current.value) {
            return alert('Wrong date from')
        }
        if (!_dateTo.current.value) {
            return alert('Wrong date to')
        }    
        const dateFrom: string = _dateFrom.current.value
        const dateTo: string = _dateTo.current.value
        setState.orders.loadOrders({userId: _user.current.value, from: dateFrom, to: dateTo})
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
                    <div className="filters">
                        <div className="filter__item">
                            <label htmlFor="user">Select user
                                <select name="" id="user" ref={_user}>
                                    <option value="all">All</option>
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
                    {loaded && 
                    <div className="orders__container">
                        dgfd
                    </div>}
                    

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
