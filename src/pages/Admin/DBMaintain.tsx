import './dbmaintain.scss'
import { IPortfolioData, IState, TLang } from "src/interfaces";
import * as actions from "../../redux/actions";
import { bindActionCreators } from "redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import { firebaseConfig } from 'src/config'
import { initializeApp } from 'firebase/app'
import {
	getFirestore,
	collection,
	getDocs,
    doc
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import img1 from '../../assets/img/portfolio/1.png'
import img2 from '../../assets/img/portfolio/2.jpeg'
import img3 from '../../assets/img/portfolio/3.jpeg'
import img4 from '../../assets/img/portfolio/4.jpeg'
import img5 from '../../assets/img/portfolio/5.png'
import img6 from '../../assets/img/portfolio/6.png'
import Portfolio from '../Portfolio/Portfolio';
import EditFeature from './ListFeatures';
import ListFeatures from './ListFeatures';
import EditFeatures from './EditFeatures';

const db = getFirestore()
const portfoliosRef = collection(db, 'Portfolios')


const getPortfolios = async () => {
    const portSnap = await getDocs(portfoliosRef);
    portSnap.forEach(doc => {
        console.log(doc.data());
    })
}


interface IProps {
    lang: TLang
    setState: typeof actions
}




const mock: Array<IPortfolioData> = [
	{
		id: '1',
		filename: img1,
		filedescr: 'Model 42',
		features: {
			En: [
				{
					name: 'Name',
					value: 'Model 42'
				},
				{
					name: 'Fiber',
					value: 'ABS'
				},
			],
			Ru: [
				{
					name: 'Название',
					value: 'Модель 42'
				},
				{
					name: 'Материал',
					value: 'ABS пластик'
				},
			],
			colors: ['1','2','3'] //ids of colors
		}
	},
	{
		id: '2',
		filename: img2,
		filedescr: 'Model 43',
		features: {
			En: [
				{
					name: 'Name',
					value: 'Model 43'
				},
				{
					name: 'Volume',
					value: '120 cm'
				},
				{
					name: '111',
					value: '1111111111'
				},
				{
					name: '222',
					value: '222222222'
				},
			],
			Ru: [
				{
					name: 'Название',
					value: 'Модель 43'
				},
				{
					name: 'Объем',
					value: '120 см'
				},
				{
					name: '111',
					value: '1111111111'
				},
				{
					name: '222',
					value: '222222222'
				},
			],
			colors: ['1','3'] //ids of colors
		}
	},
	{
		id: '3',
		filename: img3,
		filedescr: 'Model 44',
		features: {
			En: [
				{
					name: 'Name',
					value: 'Model 44'
				},
				{
					name: 'Volume',
					value: '124 cm'
				},
			],
			Ru: [
				{
					name: 'Название',
					value: 'Модель 44'
				},
				{
					name: 'Объем',
					value: '124 см'
				},
			],
			colors: ['1','3'] //ids of colors
		}
	},

]

interface IEdit {
	status: boolean
	lang: string
	index: number
}

const DBMaintain:React.FC<IProps> = (props) => {


	const [selected, setSelected] = useState<{id: string, index: number}>({id: '', index: NaN})
	const [portfolioData, setPortfolioData] = useState<IPortfolioData>({} as IPortfolioData)
	const [edit, setEdit] = useState<IEdit>({} as IEdit)

	const removeFeature = (index: number, lang: TLang) => {
		mock[selected.index].features[lang].splice(index, 1)
		setPortfolioData(JSON.parse(JSON.stringify(mock[selected.index])))
	}

	const editFeature = (index: number, lang: TLang) => {
		setEdit({status: true, lang: lang, index: index})
	}


	useEffect(() => {
		const _list = document.querySelector('.portfolios__list')
		const _containers = _list?.querySelectorAll('.porfolio__container')
		
		const onHandleSelect = (e:any) => {
			const selectedId = String(e.currentTarget.dataset.id)
			const selectedIndex = +e.currentTarget.dataset.index
			setSelected({id: selectedId, index: selectedIndex})
			setPortfolioData(mock[selectedIndex])
		}

		if (_containers?.length) {
			_containers.forEach(container => {
				container.addEventListener('click', onHandleSelect)
			})
		}
	}, [])


    return (
		<div className="container">
			<div className="dbm">
				<h2>{props.lang === 'En' ? 'Portfolio editor' : 'Редактировать портфолио'}</h2>
				<div className="portfolios__list">
					{mock.map((portfolio, index) => {
						return (
							<div className={portfolio.id === selected.id ? 'porfolio__container selected' : 'porfolio__container'} data-id={portfolio.id} data-index={index} key={portfolio.id}>
								<img src={portfolio.filename} alt={portfolio.filedescr} />
							</div>
						)
					})}
				</div>

				<div className='portfolio__features'>
					{selected.id ? <ListFeatures 
						portfolioData={portfolioData} 
						siteLang={props.lang} 
						remove={(i: number, lang: TLang) => removeFeature(i, lang)} 
						edit={(i: number, lang: TLang) => editFeature(i, lang)}/> : <></>}
					{edit.status ? <EditFeatures 
						featureData={portfolioData.features.En} 
						lang={props.lang} 
					/> : <></>}


					<div className="add-feature">
						<div className="feature">
							<h4>English</h4>
							<h4>Русский</h4>
						</div>
						<div className="feature ">
							<label>
								<span>Feature: </span>
								<input data-edit="nameEn" type="text" />
							</label>
							<label>
								<span>Свойство: </span>
								<input data-edit="nameEn" type="text" />
							</label>
						</div>
						<div className="feature">
							<label>
								<span>Value: </span>
								<input data-edit="nameRu" type="text" />
							</label>
							<label>
								<span>Значение: </span>
								<input data-edit="nameRu" type="text" />
							</label>
						</div>
					</div>


				</div>
			</div>
		</div>
    )
}




const mapStateToProps = (state: IState) => ({
    lang: state.lang,
  })
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setState: bindActionCreators(actions, dispatch)
  })
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(DBMaintain)

  /*

  					<div className="feature">
						<label>
							<span>Name: </span>
							<input data-edit="nameEn" type="text" />
						</label>
						<label>
							<span>Название: </span>
							<input data-edit="nameRu" type="text" />
						</label>
					</div>
					<div className="feature">
						<label>
							<span>Fabric: </span>
							<input data-edit="fabricEn" type="text" />
						</label>
						<label>
							<span>Материал: </span>
							<input data-edit="fabricRu" type="text" />
						</label>
					</div>
					<div className="feature">
						<label>
							<span>Volume: </span>
							<input data-edit="volumeEn" type="text" />
						</label>
						<label>
							<span>Объем: </span>
							<input data-edit="volumeRu" type="text" />
						</label>
					</div>
					<div className="feature">
						<label>
							<span>Hardeness: </span>
							<input data-edit="hardnessEn" type="text" />
						</label>
						<label>
							<span>Прочность: </span>
							<input data-edit="hardnessRu" type="text" />
						</label>
					</div>
*/					


/*

<div className="features">
									<ul className='features_en'>
										{portfolio.features.en.map(feature => {
											return (
												<li>
													<span>{feature.name}: </span>
													<span>{feature.value}</span>
												</li>
											)
										})}
									</ul>
									<div className="separator"></div>
									<ul className='features_ru'>
										{portfolio.features.ru.map(feature => {
											return (
												<li>
													<span>{feature.name}: </span>
													<span>{feature.value}</span>
												</li>
											)
										})}
									</ul>
								</div>

*/