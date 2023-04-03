import { IColorID, IDataLoading, IFiber, TCollectionNames, TLoadDataStatus } from './../interfaces';
import * as actions from './actionsList'
import { IAction, IActionCreator, IDispatch, IFeatures, IPortfolioData, IPortfolioImage, TLang } from 'src/interfaces'

import { firebaseConfig } from 'src/config'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
	getFirestore,
	collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    QuerySnapshot,
    DocumentData,
    getDoc,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from "firebase/storage";
//import { localState } from 'src/pages/Admin/Portfolios/PortfoliosEdit'


const appDB = initializeApp(firebaseConfig)
const db = getFirestore()
const storage = getStorage();

const collectionPortfoliosRef = collection(db, 'portfolios');
//const collectionFibersRef = collection(db, 'fibers');



export const setLangEn = <T>(): IAction<T> => ({
    type: actions.SET_LANG_EN,
})

export const setLangRu = <T>(): IAction<T> => ({
    type: actions.SET_LANG_RU,
})


export const setThemeLight = <T>(): IAction<T> => ({
    type: actions.SET_THEME_LIGHT,
})

export const setThemeDark = <T>(): IAction<T> => ({
    type: actions.SET_THEME_LIGHT,
})

export const setThemeToggle = <T>(): IAction<T> => ({
    type: actions.SET_THEME_TOGGLE,
})

export const setNavOpen = <T>():IAction<T> => ({
    type: actions.SET_NAV_OPEN,
});

export const setNavClose = <T>():IAction<T> => ({
    type: actions.SET_NAV_CLOSE,
});

export const setNavToggle = <T>():IAction<T> => ({
    type: actions.SET_NAV_OPEN,
});






export const setPortfoliosStatusError = <T extends string>(payload: T):IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_ERROR,
    payload: payload
});

export const setPortfoliosStatusLoading = <T>():IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_LOADING,
});

export const setPortfoliosStatusSaving = <T>():IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_SAVING,
});

export const setPortfoliosStatusSuccess = <T>():IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_SUCCESS,
});


export const setPortfoliosStatusIdle = <T>():IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_IDLE,
});


export const loadPortfolios = <T extends IPortfolioData[]>(payload: T):IAction<T> => ({
    type: actions.LOAD_PORTFOLIOS,
    payload: payload
});


/*
export const setLoadDataStatus = <T extends TLoadDataStatus>(payload: T):IAction<T> => ({
    type: actions.SET_PORTFOLIOS_STATUS_IDLE,
    payload: payload
});

*/



/*
export const setLoadDataStatus = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: actions.SET_LOAD_DATA_STATUS,
    payload: payload
});

export const setData = <T extends any>(payload: T):IAction<T> => ({
    type: actions.SET_DATA,
    payload: payload
});
*/


//----------------------------------------------------------------------------
export const setLoadDataStatusFibers = <T extends IDataLoading>(payload: T):IAction<T> => ({
    type: actions.SET_LOAD_DATA_STATUS_FIBERS,
    payload: payload
});

export const setDataFibers = <T extends Array<IFiber>>(payload: T):IAction<T> => ({
    type: actions.SET_DATA_FIBERS,
    payload: payload
});

export const loadDataFibers = ({lang}: {lang: TLang}) => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatusFibers({status: 'loading', lang, message: `Loading fibers -> ${lang}`}))
        try {
            const collectionOfData = collection(db, 'fibers');
            const dataRef = doc(collectionOfData, lang);
            const docData = await getDoc(dataRef)
            if (!docData.exists()) {
                throw new Error(`Language not found in collection fibers: ${lang}`)
            }
            const rawData = docData.data()
            const dataProp = rawData.data
            if (!dataProp) {
                throw new Error(`No data in field "data" for: fibers -> ${lang}`)
            }
            const data = JSON.parse(dataProp) as Array<IFiber>

            await Promise.all(
                data.map(fiber => {
                    return new Promise((res,rej) => {
                        fiber.img.map(async img => {
                            img.url = await getDownloadURL(ref(storage, `fibers/${img.path}`))
                            res('ok')
                        })
                    })
                })
            )
            console.log('loaded', data)
            dispatch(setLoadDataStatusFibers({status: 'success', lang, message: `Data fibers -> ${lang} loaded successfully`}))
            dispatch(setDataFibers(data))
        } catch (e) {
            console.error(`ERROR while connectin to Firebase using collectionName=fibers, lang=${lang} ${e}`);
            dispatch(setLoadDataStatusFibers({status: 'error', lang, message: `ERROR while connectin to Firebase using collectionName=fibers, lang=${lang}: ${e}`}))
        }


        //dispatch(setLoadDataStatusFibers({status: 'idle', lang, message: `Last loaded data: collectionName=fibers, lang=${lang}`}))
    }
}

/*
export const loadData = ({collectionName, lang}: {collectionName: TCollectionNames, lang: TLang}) => {
    return async function(dispatch: IDispatch) {
        dispatch(setLoadDataStatus({status: 'loading', dataName: collectionName, lang, message: `Loading ${collectionName} -> ${lang}`}))
        try {
            const collectionOfData = collection(db, collectionName);
            const dataRef = doc(collectionOfData, lang);
            const docData = await getDoc(dataRef)
            if (!docData.exists()) {
                throw new Error(`Language not found in collection ${collectionName}: ${lang}`)
            }
            const rawData = docData.data()
            const dataProp = rawData.data
            if (!dataProp) {
                throw new Error(`No data in field "data" for: ${collectionName} -> ${lang}`)
            }
            const data = JSON.parse(dataProp)
            console.log('loaded', data)
            dispatch(setLoadDataStatus({status: 'success', dataName: collectionName, lang, message: `Data ${collectionName} -> ${lang} loaded successfully`}))
            //dispatch(setData({dataName: collectionName, value: ...data}))
        } catch (e) {
            console.error(`ERROR while connectin to Firebase using collectionName=${collectionName}, lang=${lang} ${e}`);
            dispatch(setLoadDataStatus({status: 'error', dataName: collectionName, lang, message: `ERROR while connectin to Firebase using collectionName=${collectionName}, lang=${lang}: ${e}`}))
        }
        dispatch(setLoadDataStatus({status: 'idle', dataName: collectionName, lang, message: `Last loaded data: collectionName=${collectionName}, lang=${lang}`}))
    }
}*/
//======================================================================================



















export const getPortfolios = () => {
    return async function(dispatch: IDispatch) {
        dispatch(setPortfoliosStatusLoading())
        const portfoliosList = await getDocs(collectionPortfoliosRef)
        const receivedPortfolios: Array<IPortfolioData> = []

        await new Promise((res,rej) => {
            const allProtfolios = portfoliosList.docs.map(portfolio => {
                return new Promise((res, rej) => {
                    const currentPortfolio = {} as IPortfolioData
                    currentPortfolio.id = portfolio.id
                    currentPortfolio.changed = false
                    currentPortfolio.descr = portfolio.data().descr
                  
                    //colors
                    const getColors = new Promise(async (res, rej) => {
                        const collectionColorsRef = collection(collectionPortfoliosRef, portfolio.id, 'colors');
                        currentPortfolio.colors = []
                        const colorsList = await getDocs(collectionColorsRef)
                        colorsList.forEach(color => currentPortfolio.colors.push({id: color.id, colorId: color.data().colorId}))
                        res('ok')
                    })
        
                    //images
                    const getImages = new Promise(async (res, rej) => {
                        const collectionImagesRef = collection(collectionPortfoliosRef, portfolio.id, 'images');
                        const imagesList = await getDocs(collectionImagesRef)
                        currentPortfolio.images = []
                        imagesList.forEach(image => currentPortfolio.images.push({id: image.id, path: image.data().path, descr: image.data().descr}))
                        res('ok')
                    })
            
                    //features
                    const getFeatures = new Promise(async (res, rej) => {
                        currentPortfolio.features = {} as IFeatures
                        const languages: TLang[] = ['En', 'Ru']
                        
                        const allLanguages = languages.map(lang => {
                            return new Promise(async (res,rej) => {
                                const collectionFeaturesRef = collection(collectionPortfoliosRef, portfolio.id, lang);
                                const featuresList = await getDocs(collectionFeaturesRef)
                                currentPortfolio.features[lang] = []
                                featuresList.forEach(feature => currentPortfolio.features[lang].push({id: feature.id, name: feature.data().name, value: feature.data().value}))
                                res('ok') //allLanguages
                            })
                        })
                        Promise.all(allLanguages).then(() => res('ok')) //getFeatures
                    })
                    
                    //save data to portfolioList
                    Promise.all([getColors, getImages, getFeatures]).then(() => {
                        receivedPortfolios.push(currentPortfolio)
                        res('ok') //allPortfolios
                    })

                })

            })

            Promise.all(allProtfolios).then(() => res('ok'))
        })
        
    
        if (receivedPortfolios.length > 0) {
            dispatch(setPortfoliosStatusSuccess())
            dispatch(loadPortfolios(receivedPortfolios))
        } else {
            dispatch(setPortfoliosStatusError('Database does not exist or empty'))
        }


/*
        if (receivedPortfolios.length > 0) {
            dispatch(setPortfoliosStatusSuccess())
            dispatch(loadPortfolios(receivedPortfolios))
        } else {
            dispatch(setPortfoliosStatusError('Database does not exist or empty'))
        }
        */


        /*
        if(portfolios.exists()) {
            console.log(docSnap.data());
            //dispatch(loadPortfolios(docSnap.data()))
            dispatch(setPortfoliosStatusSuccess())
        } else {
        }
        dispatch(setPortfoliosStatusIdle())*/

        //dispatch(setPortfoliosStatusIdle())
    }
}





export const savePortfolios = (payload: Array<IPortfolioData>) => {
    return async function(dispatch: IDispatch) {
        dispatch(setPortfoliosStatusSaving())
        
        //delete collection "portfolios"
        
        // Delete the document and all its subcollections
        const docs = await getDocs(collectionPortfoliosRef)
        
        docs.forEach(async (doc) => {
            if (payload.some(el => doc.id === el.id)) {
                console.log(doc.id);
                
                const collectionColorsRef = collection(collectionPortfoliosRef, doc.id, 'colors');
                const colorsList = await getDocs(collectionColorsRef)
                colorsList.forEach(color => deleteDoc(color.ref))

                const collectionImagessRef = collection(collectionPortfoliosRef, doc.id, 'images');
                const imagesList = await getDocs(collectionImagessRef)
                imagesList.forEach(image => deleteDoc(image.ref))


                const langs = ['En', 'Ru'] as TLang[]
                langs.forEach(async lang => {
                    const collectionFeaturesRef = collection(collectionPortfoliosRef, doc.id, `${lang}`);
                    const featuresList = await getDocs(collectionFeaturesRef)
                    featuresList.forEach(feature => deleteDoc(feature.ref))

                })

                deleteDoc(doc.ref)

            }   
        });

    /*          
        //fill with new data
        payload.forEach(async portfolio => {
            console.log(portfolio);
            
            //save portfolio 1-st level data
            //const portfolioRef = doc(collectionPortfoliosRef); 
            //const portfolioRef = doc(collectionPortfoliosRef, portfolio.id);  //for id
            const portfolioRef = portfolio.id ? doc(collectionPortfoliosRef, portfolio.id) : doc(collectionPortfoliosRef); 
            await setDoc(portfolioRef, {
                descr: portfolio.descr,
            });

            //colors
            const collectionColorsRef = collection(collectionPortfoliosRef, portfolioRef.id, 'colors');
            portfolio.colors.forEach(async color => {
                //const colorRef = doc(collectionColorsRef); 
                //const colorRef = doc(collectionColorsRef, color.id);  //for id
                const colorRef = color.id ? doc(collectionColorsRef, color.id) : doc(collectionColorsRef); 
                await setDoc(colorRef, {
                    colorId: color.colorId
                });
            })

            //images
            const collectionImagesRef = collection(collectionPortfoliosRef, portfolioRef.id, 'images');
            portfolio.images.forEach(async image => {
                //const imageRef = doc(collectionImagesRef); 
                //const imageRef = doc(collectionImagesRef, image.id);  //for id
                const imageRef = image.id ? doc(collectionImagesRef, image.id) : doc(collectionImagesRef); 
                await setDoc(imageRef, {
                    path: image.path,
                    descr: image.descr
                });
            })

            //features for all languages
            const langs = Object.keys(portfolio.features) as TLang[]
            langs.forEach(lang => {
                const collectionFeaturesRef = collection(collectionPortfoliosRef, portfolioRef.id, `${lang}`);
                portfolio.features[lang].forEach(async feature => {
                    const featureRef = feature.id ? doc(collectionFeaturesRef, feature.id) : doc(collectionFeaturesRef); 
                    //const featureRef = doc(collectionFeaturesRef, feature.id);  //for id
                    await setDoc(featureRef, {
                        name: feature.name,
                        value: feature.value
                    });
                })
            })


        })
*/
    }
}
    



export const createPortfolios = (payload: Array<IPortfolioData>) => {
    return async function(dispatch: IDispatch) {
        dispatch(setPortfoliosStatusLoading())
        //delete collection "portfolios"
        const docs = await getDocs(collectionPortfoliosRef)
        docs.forEach((doc) => {
            //console.log(doc.data());
            deleteDoc(doc.ref)
        });

        /*const languages: TLang[] = ['En', 'Ru']
        languages.forEach(async lang => {
            const langRef = doc(collectionLanguagesRef); 
            //const colorRef = doc(collectionColorsRef, color.id);  //for id
            await setDoc(langRef, {
                language: lang
            });
        })*/
              
        //fill with new data
        payload.forEach(async portfolio => {
                       
 
            //save portfolio 1-st level data
            const portfolioRef = doc(collectionPortfoliosRef); 
            //const portfolioRef = doc(collectionPortfoliosRef, portfolio.id);  //for id
            await setDoc(portfolioRef, {
                descr: portfolio.descr,
            });

            //colors
            const collectionColorsRef = collection(collectionPortfoliosRef, portfolioRef.id, 'colors');
            portfolio.colors.forEach(async color => {
                const colorRef = doc(collectionColorsRef); 
                //const colorRef = doc(collectionColorsRef, color.id);  //for id
                await setDoc(colorRef, {
                    colorId: color.colorId
                });
            })

            //images
            const collectionImagesRef = collection(collectionPortfoliosRef, portfolioRef.id, 'images');
            portfolio.images.forEach(async image => {
                const imageRef = doc(collectionImagesRef); 
                //const imageRef = doc(collectionImagesRef, image.id);  //for id
                await setDoc(imageRef, {
                    path: image.path,
                    descr: image.descr
                });
            })

            //features for all languages
            const langs = Object.keys(portfolio.features) as TLang[]
            langs.forEach(lang => {
                const collectionFeaturesRef = collection(collectionPortfoliosRef, portfolioRef.id, `${lang}`);
                portfolio.features[lang].forEach(async feature => {
                    const featureRef = doc(collectionFeaturesRef); 
                    //const featureEnRef = doc(collectionFeaturesRef, feature.id);  //for id
                    await setDoc(featureRef, {
                        name: feature.name,
                        value: feature.value
                    });
                })
            })

            


            //console.log(portfolioRef.id);
            


            //fill the colors
            /*const colorsList = portfolio.colors.reduce((acc, color, index) => {
                const colorId = color.id ?? 
                const name = 'id'+index
                return {...acc, [name]: color}
            }, {})
            await setDoc(portfolioSubColorsRef,colorsList);*/
           /* portfolio.colors.forEach(async (color) => {

                if (color.ownId) {
                    const portfolioSubColorsRef = doc(portfolioRef, 'colors', color.ownId);
                    await setDoc(portfolioSubColorsRef, {colorID: color.colorId})
                } else {
                    const portfolioSubColorsRef = setDoc(portfolioRef, 'colors');
                    console.log(portfolioSubColorsRef.id);
                    
                    await setDoc(portfolioSubColorsRef, {colorID: color.colorId})
                }
            })*/


            //fill the images
          /*  portfolio.images.forEach(async (image, index) => {
               // const portfolioSubImageRef = doc(portfolioRef, 'images', String(index));
                /*await setDoc(portfolioSubImagesRef, {
    
                });
            })*/



        })
        


/*
const docRef = doc(db, "customers", user.uid);
const colRef = collection(docRef, "checkout_sessions")
addDoc(colRef, {
 price: priceId,
 and: two,
 more: pairs,
});
*/





        //delete collection "test"
        /*const temp = collection(db,'portfolios', portfolio.id, 'test');
        const docsTemp = await getDocs(temp)
        docsTemp.forEach((doc) => deleteDoc(doc.ref));*/
        
        /*
        collectionImagesRef = collection(collectionPortfoliosRef, portfolioRef.id, 'colors'); - create new collection (db/path, document_parent_for_collection, collection_name)
        colorRef = doc(collectionPortfoliosRef, color.id); - create new doc for collection (collection, doc_name), w/o doc_name - auto id
            await setDoc(colorRef, {  - await setDoc(doc_ref, {adding_object}
                test: '111'
            });
        
        */



/*
        try {
            await setDoc(doc(db, "portfolios", "list"), {
                name: "data",
                value: JSON.stringify(payload)
            });
            dispatch(setPortfoliosStatusSuccess())
        } catch(e: any) {
            dispatch(setPortfoliosStatusError('Error while writing data to database: '+e))
        }
        dispatch(setPortfoliosStatusIdle())*/
    }
}
    