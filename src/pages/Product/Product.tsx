import "./product.scss"
import { useRef, useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate, useParams  } from "react-router-dom"
import Preloader from '../../components/Preloaders/Preloader';
import { AnyAction, bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { ICatalogState, IColorsState, IFibersState, IFullState, IProduct, TLang } from "../../interfaces";
import SpliderPreview from "../../components/Spliders/Preview/SpliderPreview";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { allActions } from "../../redux/actions/all";
import IconEdit from "../../components/IconEdit/IconEdit";
import Delete from "../../components/Delete/Delete";
import Modal, { IModalFunctions } from "../../components/Modal/Modal";
import Message, { IMessageFunctions } from "../../components/Message/Message";
import { navList, resetFetch, timeModalClosing } from "../../assets/js/consts";
import { checkAndLoad, modalMessageCreator } from "../../assets/js/processors";


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
    const modalMessageRef = useRef<IModalFunctions>(null)
    const messageRef = useRef<IMessageFunctions>(null)


    useEffect(() => {
        if (catalogState.category.sendProduct.status === 'success' || catalogState.category.sendProduct.status === 'error') {
            messageRef.current?.update(modalMessageCreator(catalogState.category.sendProduct, lang))
            modalMessageRef.current?.openModal()
        }
    }, [catalogState.category.sendProduct.status])


    const closeModalMessage = useCallback(() => {
        modalMessageRef.current?.closeModal()
        setTimeout(() => messageRef.current?.clear(), timeModalClosing)  //otherwise message content changes before closing modal
        if (catalogState.category.sendProduct.status === 'success') {
            navigate(navList.catalog.to, { replace: true });
            window.location.reload()
        }
        setState.catalog.setSendProduct({...resetFetch})
	}, [catalogState.category.sendProduct.status])



    useEffect(() => {
        if (colorsState.load.status === 'success' && fibersState.load.status === 'success' && catalogState.category.loadProduct.status === 'success' && paramProductId === catalogState.category.product._id) {
            setLoaded(true)
        } else {
            checkAndLoad({
                fetchData: colorsState.load,
                loadFunc: setState.colors.loadColors,
            })
            if (paramProductId !== catalogState.category.product._id) {
                checkAndLoad({
                    fetchData: catalogState.category.loadProduct,
                    loadFunc: setState.catalog.loadProduct,
                    args: [paramProductId]
                })
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
                                    <SpliderPreview images={catalogState.category.product.images} sizePreview='preview' sizeMain="medium"  />
                                </div>
                                <div className="details__descr-order">
                                    <ProductDetails />
                                </div>
                            </div>

                            {isAdmin && 
                                <div className="buttons">
                                    <NavLink className="button_edit" to={`../..${navList.account.admin.product.to}/${catalogState.category.product._id}`}>
                                        <IconEdit />
                                    </NavLink>
                                    <Delete<IProduct> remove={onDelete} idInstance={catalogState.category.product} lang={lang} disabled={catalogState.category.sendProduct.status === 'fetching'}/>
                                </div>
                            }
                        </>
                    :
                        <Preloader />}
                </div>
                <Modal escExit={true} ref={modalMessageRef} onClose={closeModalMessage}>
                    <Message buttonText={lang === 'en' ? `Close` : `Закрыть`} buttonAction={closeModalMessage} ref={messageRef}/>
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
