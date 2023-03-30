import { IGalleryItem, IState, TLang } from "src/interfaces";
import * as actions from "../../redux/actions";
import { bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import './gallery.scss'
import { galleryItems } from "src/assets/data/portfolios";
import { useEffect, useState } from "react";

interface IProps {
    lang: TLang
    setState: typeof actions
}

const Gallery:React.FC<IProps> = (props) => {
    
    const [portfolioItems, setportfolioItems] = useState<Array<IGalleryItem>>([...galleryItems])
    const [pageNumber, setPageNumber] = useState<number>(0)
    const itemsPerPage = 9;

    const list = <>
        {portfolioItems.map((item, index) => {
            if ((index >= itemsPerPage * pageNumber) && (index < itemsPerPage * (pageNumber + 1))) {
                return <div key={item.id}>
                    <img src={item.path} alt="rtrt" />
                </div>
            }
        })}
    </>
    


    return (
        <div className="gallery">
            {list}
        </div>
    )
}




const mapStateToProps = (state: IState) => ({
    lang: state.lang,
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Gallery)