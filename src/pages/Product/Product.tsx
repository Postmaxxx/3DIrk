import "./product.scss"
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { NavLink, useNavigate, useParams  } from "react-router-dom"
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICatalogState, IColorsState, IFetch, IFiber, IFibersState, IFullState, IProduct, TId, TLang } from "src/interfaces";
import SpliderPreview from "../../components/Spliders/Preview/SpliderPreview";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { allActions } from "../../redux/actions/all";
import IconEdit from "src/components/tiny/IconEdit/IconEdit";
import Delete from "src/components/Delete/Delete";
import Modal, { IModalFunctions } from "src/components/Modal/Modal";
import Message, { IMessageFunctions } from "src/components/Message/Message";
import { headerStatus, resetFetch, timeModalClosing } from "src/assets/js/consts";




interface IPropsState {
	lang: TLang
    catalogState: ICatalogState
    colorsState: IColorsState
    fibersState: IFibersState
    isAdmin: boolean
}

interface IPropsActions {
    setState: {
        catalog: typeof allActions.catalog,
        colors: typeof allActions.colors,
        fibers: typeof allActions.fibers,
    }
}


interface IProps extends IPropsState, IPropsActions {}


const Product: React.FC<IProps> = ({lang, setState, catalogState, colorsState, fibersState, isAdmin }): JSX.Element => {
    const navigate = useNavigate()
    const paramProductId = useParams().productId || ''
    const [loaded, setLoaded] = useState<boolean>(false)
    const modal_message = useRef<IModalFunctions>(null)
    const message = useRef<IMessageFunctions>(null)


    useEffect(() => {
        if (catalogState.category.sendProduct.status === 'success' || catalogState.category.sendProduct.status === 'error') {
            const errors: string[] = catalogState.category.sendProduct.errors?.map(e => e[lang]) || []
            message.current?.update({
                header: headerStatus[catalogState.category.sendProduct.status][lang],
                status: catalogState.category.sendProduct.status,
                text: [catalogState.category.sendProduct.message[lang], ...errors]
            })
            modal_message.current?.openModal()
        }
    }, [catalogState.category.sendProduct.status])


    const closeModalMessage = useCallback(() => {
        modal_message.current?.closeModal()
        setTimeout(() => message.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (catalogState.category.sendProduct.status === 'success') {
            navigate('/catalog', { replace: true });
            window.location.reload()
        }
        setState.catalog.setSendProduct({...resetFetch})
	}, [catalogState.category.sendProduct.status])



    useEffect(() => {
        if (colorsState.load.status === 'success' && fibersState.load.status === 'success' && catalogState.category.loadProduct.status === 'success' && paramProductId === catalogState.category.product._id) {
            setLoaded(true)
        } else {
            if (colorsState.load.status !== 'success' && colorsState.load.status !== 'fetching') {
                setState.colors.loadColors()
            }
            if (paramProductId !== catalogState.category.product._id && catalogState.category.loadProduct.status !== 'fetching') {
                setState.catalog.loadProduct(paramProductId)
            }
            setLoaded(false)
        }
    },[fibersState.load.status, colorsState.load.status, catalogState.category.loadProduct.status, paramProductId])
    


    const onDelete = (item: IProduct) => { 
        setState.catalog.deleteProduct(item._id);
    }


    return (
        <div className="page page_product-details">
            <div className="container_page">
                <div className="container">
                    <h1>{catalogState.category.product.name[lang]}</h1>
                    {loaded ? 
                        <>
                            <div className="details__block">
                                <div className="details__splider">
                                    <SpliderPreview />
                                </div>
                                <div className="details__descr-order">
                                    <ProductDetails />
                                </div>
                            </div>

                            {isAdmin && 
                                <div className="buttons">
                                    <NavLink className="button_edit" to={`../../admin/product-create/${catalogState.category.product._id}`}>
                                        <IconEdit />
                                    </NavLink>
                                    <Delete<IProduct> remove={onDelete} idInstance={catalogState.category.product} lang={lang} disabled={catalogState.category.sendProduct.status === 'fetching'}/>
                                </div>
                            }
                        </>
                    :
                        <Preloader />}
                </div>
                <Modal escExit={true} ref={modal_message} onClose={closeModalMessage}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={message}/>
                </Modal>
            </div>
        </div>
    )
}



const mapStateToProps = (state: IFullState): IPropsState => ({
    lang: state.base.lang,
    catalogState: state.catalog,
    colorsState: state.colors,
    fibersState: state.fibers,
    isAdmin: state.user.isAdmin
})


const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IPropsActions => ({
    setState: {
		catalog: bindActionCreators(allActions.catalog, dispatch),
		colors: bindActionCreators(allActions.colors, dispatch),
		fibers: bindActionCreators(allActions.fibers, dispatch),
	}
})
  
  

export default connect(mapStateToProps, mapDispatchToProps)(Product);
