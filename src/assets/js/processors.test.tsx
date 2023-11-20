import { IFetch, TLangText, IAction } from '../../interfaces';
import { ratingNumberToText, prevent, filesDownloader, filenameChanger, modalMessageCreator, deepCopy,resErrorFiller, checkIfNumbers, checkIfEmail, checkIfPhone, debounce, fetchError, makeDelay, inputChecker } from './processors'
import { exceptionTimeout } from './consts';
import { AnyAction } from 'redux';
import React from 'react'
import '@testing-library/jest-dom/extend-expect'

global.HTMLElement = window.HTMLElement;


describe('Tests for ratingNumberToText', () => {
    test('should return value out of range', () => {
        expect(ratingNumberToText('11', '3')).toEqual({en: 'Value out of range', ru: 'Значение вне диапазона'})
        expect(ratingNumberToText('0', '3')).toEqual({en: 'Value out of range', ru: 'Значение вне диапазона'})
    })

    test('should return for scale 3', () => {
        expect(ratingNumberToText('1', '3')).toEqual({en: 'none', ru: 'отсутствует'})
        expect(ratingNumberToText('3', '3')).toEqual({en: 'high', ru: 'высокая'})
    })
    
    test('should return for scale 5', () => {
        expect(ratingNumberToText('1', '5')).toEqual({en: 'low', ru: 'низкая'})
        expect(ratingNumberToText('4', '5')).toEqual({en: 'upper average', ru: 'выше средней'})
    })
    
    test('should return for scale 10', () => {
        expect(ratingNumberToText('10', '10')).toEqual({en: 'exellent',ru: 'отличная'})               
        expect(ratingNumberToText('2', '10')).toEqual({en: 'extremely low', ru: 'крайне низкая'})               

    })
})



describe('Tests for prevent', () => {
    test('should call preventDefault and stopPropagation for MouseEvent', () => {
        const mockEvent = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        } as unknown as React.MouseEvent<HTMLElement | HTMLButtonElement>;
    
        prevent(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    test('should call preventDefault and stopPropagation for ChangeEvent', () => {
        const mockEvent = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        } as unknown as React.ChangeEvent<HTMLInputElement>;
    
        prevent(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
});


describe('Tests for filesDownloader', () => {
    test('should return empty array', async () => {
        const result: File[] = await filesDownloader([''])
        expect(result).toEqual([])
    })
})




describe('Tests for filenameChanger', () => {
    const testString = '_test d.ts f._.-___  name_/__test2_3-_4_'
    test('should return array with "-" instead of "_"', () => {
        expect(filenameChanger(testString)).toBe('-test d.ts f.-.----  name-/--test2-3--4-')
    })
})




describe('Tests for fetchError', () => {
    let comp: TLangText
    let e: any
    let eNoName: any
    let controller: any

    const setter = jest.fn(<T extends IFetch>(payload: T): IAction<T> => ({
        type: 'setterActionType',
        payload
    }))

    const dispatch = jest.fn(<T extends AnyAction>(action: T): T => {
        return action;
    })
    

    beforeEach(() => {
        dispatch.mockClear()
        setter.mockClear()

        comp = {en: 'comp en', ru: 'comp ru'}
        e = {name: 'AbortError'} 
        eNoName = {}
        controller = {signal: {reason: {name: exceptionTimeout.name}}}
    }) 

    

    test('e.name === AbortError', () => {
        const payload = {status: 'error', message: {en: 'comp en: server response timeout', ru: "comp ru: таймаут ответа от сервера"}}
        const expectedResult = {type: "setterActionType", payload}
        fetchError({dispatch, setter, comp, e, controller})
        expect(dispatch).toBeCalledTimes(1)
        expect(setter).toBeCalledTimes(1)
        expect(setter).toBeCalledWith(payload)
        expect(dispatch).toBeCalledWith(expectedResult)
    })


    test('e.name === AbortError && controller.signal.reason.name = "otherReason"', () => {
        const payload = {status: 'idle', message: {en: 'comp en: request aborted', ru: "comp ru: запрос отменен"}}
        const expectedResult = {type: "setterActionType", payload}
        controller.signal.reason.name = 'otherReason'

        fetchError({dispatch, setter, comp, e, controller})
        expect(dispatch).toBeCalledTimes(1)
        expect(setter).toBeCalledTimes(1)
        expect(setter).toBeCalledWith(payload)
        expect(dispatch).toBeCalledWith(expectedResult)
    })


    test('e.name !== AbortError', () => {
        const payload = {status: 'error', message: {en: 'comp en: testError', ru: "comp ru: testError"}}
        const expectedResult = {type: "setterActionType", payload}
        e = {name: 'testError'} 

        fetchError({dispatch, setter, comp, e, controller})
        expect(dispatch).toBeCalledTimes(1)
        expect(setter).toBeCalledTimes(1)
        expect(setter).toBeCalledWith(payload)
        expect(dispatch).toBeCalledWith(expectedResult)
    })
})




describe('Tests for modalMessageFromCreator', () => {
    test('should return errors ru', () => {
        const sourceErr:IFetch = {
            status: 'error',
            message: {en: 'msg en', ru: 'msg ru'},
            errors: [{en: 'err en 1', ru: 'err ru 1'}, {en: 'err en 2', ru: 'err ru 2'}]
        }
        expect(modalMessageCreator(sourceErr, 'ru')).toEqual({
            header: 'Ошибка',
            status: sourceErr.status,
            text: ['msg ru', 'err ru 1', 'err ru 2']
        })
    })


    test('should return only message en', () => {
        const sourceErr:IFetch = {
            status: 'error',
            message: {en: 'msg en', ru: 'msg ru'},
        }
        expect(modalMessageCreator(sourceErr, 'en'))
            .toEqual({
                header: 'Error',
                status: sourceErr.status,
                text: ['msg en']
        })
    })


    test('should return success en', () => {
        const sourceSuccess:IFetch = {
            status: 'success',
            message: {en: 'msg en', ru: 'msg ru'},
            errors: [{en: 'err en 1', ru: 'err ru 1'}, {en: 'err en 2', ru: 'err ru 2'}]
        }
        expect(modalMessageCreator(sourceSuccess, 'en')).toEqual({
            header: 'Success',
            status: sourceSuccess.status,
            text: ['msg en', 'err en 1', 'err en 2']
        })
    })
})



describe('Tests for deepcopy', () => {
    let testObj: {}

    beforeEach(() => {
        testObj = {a: {b: {c: 'c', d: 'd'}, e: [{f: 'f', g: {h: 'h', i: [1, 2]}}]}}
    })

    test('should return deep copy', () => {
        expect(deepCopy(testObj)).toEqual({a: {b: {c: 'c', d: 'd'}, e: [{f: 'f', g: {h: 'h', i: [1, 2]}}]}})
    })

    
    test('should return different object', () => {
        expect(deepCopy(testObj)).not.toBe(testObj)
    })
})


/*
describe('Tests for focusMover', () => {
    let focuserString: ReturnType<typeof focusMover> = focusMover()
    let focuserDOM: ReturnType<typeof focusMover> = focusMover()

    const Root = () => {
        return (
            <div id='root'>
                <div className="block_input" data-selector="input-block">
                    <textarea data-selector="input" id="text_1"></textarea>
                </div>
                <div className="block_input" data-selector="input-block">
                    <input data-selector="input" id="text_2" />
                </div>
                <div className="block_input" data-selector="input-block">
                    <input data-selector="input" id="text_3" />
                </div>
                <div className="block_input" data-selector="input-block">
                    <input data-selector="input" id="text_4" />
                </div>
            </div>
        )
    }
    
    beforeEach(() => {  
        document.body.innerHTML = `
            <div id='root'>
                <div class="block_input" data-selector="input-block">
                    <textarea data-selector="input" id="text_1"></textarea>
                </div>
                <div class="block_input" data-selector="input-block">
                    <input data-selector="input" id="text_2" />
                </div>
                <div class="block_input" data-selector="input-block">
                    <input data-selector="input" id="text_3" />
                </div>
                <div class="block_input" data-selector="input-block">
                    <input data-selector="input" id="text_4" />
                </div>
            </div>`
        focuserString.create({container: '#root', itemsSelector: '[data-selector="input"]'})
    })

    afterAll(() => {
        document.body.innerHTML = ``
    })
    
    
    test('clear() should clear focusMover, length() should return correct length. for container is string', () => {
        expect(focuserString.length()).toBe(4)
        focuserString.clear()
        expect(focuserString.length()).toBe(0)
    });



    test('clear() should clear focusMover length() should return correct length for container is DOMElement', () => {
        let focuserDOM: ReturnType<typeof focusMover> = focusMover()
        focuserDOM.create({})
        expect(focuserDOM.length()).toBe(4)
        focuserDOM.clear()
        expect(focuserDOM.length()).toBe(0)
    });



    test('next() should focus next element', () => {
        let focusCount = 0
        const focused = () => { focusCount++ }

        const { container } = render(<Root />)
        const root = container.querySelector('#root') as HTMLElement
        focuserDOM.create({container: root, itemsSelector: '[data-selector="input"]'})
        const inputElements = [...root.querySelectorAll('[data-selector="input"]')] as HTMLInputElement[] | HTMLTextAreaElement[]
        inputElements.forEach(el => el.addEventListener('focus', focused))
        inputElements[0].focus() //select first input element
        expect(document.activeElement).toBe(inputElements[0])

        const mockEvent = {
            key: 'Enter',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>

        focuserDOM.next(mockEvent)//stopPropagation = 1 preventDefault = 1
        expect(document.activeElement).not.toBe(inputElements[0])
        expect(document.activeElement).toBe(inputElements[1])
        focuserDOM.next(mockEvent) //stopPropagation = 2 preventDefault = 2
        focuserDOM.next(mockEvent)//stopPropagation = 3 preventDefault = 3
        focuserDOM.next(mockEvent)//stopPropagation = 4 preventDefault = 4
        expect(document.activeElement).toBe(inputElements[0])
        expect(focusCount).toBe(5) 
        focuserDOM.focusAll() //focus each element one time, first element selected
        expect(focusCount).toBe(9)
        focuserDOM.next(mockEvent) //the second element is selected, stopPropagation = 5 preventDefault = 5
        expect(focusCount).toBe(10) 

        focusCount = 0
        mockEvent.key = 'NotEnter'
        focuserDOM.next(mockEvent) //stopPropagation = 6
        expect(focusCount).toBe(0) 


        //check if list of elements is empty
        focuserDOM.clear()
        focuserDOM.next(mockEvent) //stopPropagation = 7
        focuserDOM.focusAll()
        expect(focusCount).toBe(0) 

        //check 1 element in list
        focuserDOM.clear()
        focuserDOM.create({container: root, itemsSelector: '#text_1'})
        expect(focusCount).toBe(0)
        focuserDOM.next(mockEvent) //stopPropagation = 8
        expect(focusCount).toBe(0)
        focuserDOM.focusAll()
        expect(focusCount).toBe(2)


        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(5)
        expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(8)
    });

})
*/



describe('Tests for resErrorFiller', () => {

    let errors: TLangText[]
    let message: TLangText

    beforeEach(() => {
        errors = [{en: 'err 1 en', ru: 'error ru 1'}, {en: 'err 2 en', ru: 'error ru 2'}]
        message = {en: 'test message en', ru: 'test message ru'}
    })

    test('should return errors object', () => {
        expect(resErrorFiller({errors, message})).toEqual({
            status: 'error',
            message: {en: 'test message en', ru: 'test message ru'},
            errors: [{en: 'err 1 en', ru: 'error ru 1'}, {en: 'err 2 en', ru: 'error ru 2'}]
        })
    })

    test('should return empty array errors object', () => {
        expect(resErrorFiller({errors: [], message})).toEqual({
            status: 'error',
            message: {en: 'test message en', ru: 'test message ru'},
            errors: []
        })
        expect(resErrorFiller({message})).toEqual({
            status: 'error',
            message: {en: 'test message en', ru: 'test message ru'},
            errors: []
        })
    })


    test('should not return the same errors array', () => {
        expect(resErrorFiller({errors, message}).errors).not.toBe(errors)
    })

})




describe('Tests for checkIfNumbers', () => {
    test('should return false', () => {
        expect(checkIfNumbers('1234567890q1')).toBe(false)
        expect(checkIfNumbers('1234567890_')).toBe(false)
        expect(checkIfNumbers('+1234567890')).toBe(false)
        expect(checkIfNumbers('-1234567890')).toBe(false)
    })
    
    test('should return true', () => {
        expect(checkIfNumbers('01243205403254630560124902346')).toBe(true)
        expect(checkIfNumbers('0')).toBe(true)
        expect(checkIfNumbers('')).toBe(true)
    })
})



describe('Tests for checkIfPhone', () => {
    test('should return false', () => {
        expect(checkIfPhone('++1234567890')).toBe(false)
        expect(checkIfPhone('1234567890a')).toBe(false)
        expect(checkIfPhone('1.34567890')).toBe(false)
        expect(checkIfPhone('1,34567890')).toBe(false)
        expect(checkIfPhone('123*')).toBe(false)
        expect(checkIfPhone('')).toBe(false)
        expect(checkIfPhone('+')).toBe(false)
    })
    
    test('should return true', () => {
        expect(checkIfPhone('01243205403254630560124902346')).toBe(true)
        expect(checkIfPhone('+01243205403254630')).toBe(true)
        expect(checkIfPhone('+1')).toBe(true)
        expect(checkIfPhone('1')).toBe(true)
    })
})


describe('Tests for checkIfEmail', () => {
    test('should return false', () => {
        expect(checkIfEmail('test@test.test.test.')).toBe(false)
        expect(checkIfEmail('')).toBe(false)
        expect(checkIfEmail('1@')).toBe(false)
        expect(checkIfEmail('1@1')).toBe(false)
        expect(checkIfEmail('1@1')).toBe(false)
        expect(checkIfEmail('1@1.')).toBe(false)
        expect(checkIfEmail('@sdfds.')).toBe(false)
        expect(checkIfEmail('@sdfds.fgdg')).toBe(false)
        expect(checkIfEmail('a@b.c')).toBe(false)
    })
    
    test('should return true', () => {
        expect(checkIfEmail('a@b.dsf')).toBe(true)
        expect(checkIfEmail('test@test.test.test.re')).toBe(true)
        expect(checkIfEmail('test.test.@gmail.com')).toBe(true)
    })
})





describe('Tests for debounce', () => {
    const mockCallback = jest.fn();
    
    beforeEach(() => {
        mockCallback.mockClear();
        jest.useFakeTimers();
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });



    test('should debounce a function', () => {
        const debouncedFunction = debounce(mockCallback, 1000);

        debouncedFunction();
        debouncedFunction();
        debouncedFunction();

        jest.advanceTimersByTime(1000);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });



    test('should pass arguments to the debounced function', () => {
        const debouncedFunction = debounce(mockCallback, 1000);
        let argsList: any[] = [1, {a: 2}, 3]
        debouncedFunction(...argsList);

        jest.advanceTimersByTime(1000);

        expect(mockCallback).toHaveBeenCalledWith(...argsList);
    });



    test('should reset the debounce timer if called again within the delay', () => {
        const debouncedFunction = debounce(mockCallback, 1000);

        debouncedFunction();
        jest.advanceTimersByTime(500);
        debouncedFunction();
        jest.advanceTimersByTime(700);
        debouncedFunction();
        jest.advanceTimersByTime(1100);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});






describe('Tests for makeDelay', () => {

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })


    test('should make delay 1000', async () => {
        const delay = 3000
        const promise = makeDelay(delay);
        jest.advanceTimersByTime(2999);
        expect(promise).not.toHaveProperty('value');
        jest.advanceTimersByTime(1);
        const result = await promise;
        expect(result).toBe(`Timeout ${delay}ms has been finished`);
    })
    
    test('should make delay 0', async () => {
        const promise = makeDelay(0);
        jest.advanceTimersByTime(0);
        const result = await promise;
        expect(result).toBe('Timeout 0ms has been finished')
    })

    test('should not make delay if delay not provided', async () => {
        const promise = makeDelay();
        jest.advanceTimersByTime(0);
        const result = await promise;
        expect(result).toBe('Timeout 0ms has been finished')
    })
})



describe('Tests for inputChecker', () => {

    test('rules.notEmpty', () => {
        expect(inputChecker({value: '', rules: {notEmpty: true}})).toEqual({en: `no value`, ru: `нет значения`})
        expect(inputChecker({value: ' ', rules: {notEmpty: true}})).not.toEqual({en: `no value`, ru: `нет значения`})
        expect(inputChecker({value: '', rules: {notEmpty: false}})).toBeNull()
        expect(inputChecker({value: '', rules: {}})).toBeNull()
    })


    test('rules.min', () => { 
        expect(inputChecker({value: '', rules: {min: 1}})).toEqual({en: `length < 1`, ru: `длина < 1`})
        expect(inputChecker({value: '12345', rules: {min: 6}})).toEqual({en: `length < 6`, ru: `длина < 6`})
        expect(inputChecker({value: '12', rules: {min: 1}})).not.toEqual({en: `length < 1`, ru: `длина < 1`})
        expect(inputChecker({value: '', rules: {min: 0}})).not.toEqual({en: `length < 1`, ru: `длина < 1`})
        expect(inputChecker({value: '1234567', rules: {min: 6}})).not.toEqual({en: `length < 6`, ru: `длина < 6`})
    })

    test('rules.max', () => {
        expect(inputChecker({value: '156546', rules: {max: 0}})).toEqual({en: `length > 0`, ru: `длина > 0`})
        expect(inputChecker({value: '1234567', rules: {max: 6}})).toEqual({en: `length > 6`, ru: `длина > 6`})
        expect(inputChecker({value: '156546', rules: {max: 7}})).not.toEqual({en: `length > 0`, ru: `длина > 0`})
        expect(inputChecker({value: '', rules: {max: 0}})).not.toEqual({en: `length > 6`, ru: `длина > 6`})
    })
    
    test('rules.valueMin', () => {
        expect(inputChecker({value: '-10', rules: {valueMin: -9}})).toEqual({en: `value < -9`, ru: `значение < -9`})
        expect(inputChecker({value: '-1', rules: {valueMin: 0}})).toEqual({en: `value < 0`, ru: `значение < 0`})
        expect(inputChecker({value: '0', rules: {valueMin: 1}})).toEqual({en: `value < 1`, ru: `значение < 1`})
        expect(inputChecker({value: '999', rules: {valueMin: 1000}})).toEqual({en: `value < 1000`, ru: `значение < 1000`})
        expect(inputChecker({value: '1.998', rules: {valueMin: 1.999}})).toEqual({en: `value < 1.999`, ru: `значение < 1.999`})
        expect(inputChecker({value: '-8', rules: {valueMin: -9}})).not.toEqual({en: `value < -9`, ru: `значение < -9`})
        expect(inputChecker({value: '.001', rules: {valueMin: 0}})).not.toEqual({en: `value < 0`, ru: `значение < 0`})
        expect(inputChecker({value: '10', rules: {valueMin: 10}})).not.toEqual({en: `value < 10`, ru: `значение < 10`})
        expect(inputChecker({value: 'abc', rules: {valueMin: 0}})).not.toEqual({en: `value < 0`, ru: `значение < 0`})
    })

    test('rules.valueMax', () => {
        expect(inputChecker({value: '-10', rules: {valueMax: -11}})).toEqual({en: `value > -11`, ru: `значение > -11`})
        expect(inputChecker({value: '1', rules: {valueMax: 0}})).toEqual({en: `value > 0`, ru: `значение > 0`})
        expect(inputChecker({value: '0', rules: {valueMax: -1}})).toEqual({en: `value > -1`, ru: `значение > -1`})
        expect(inputChecker({value: '1000', rules: {valueMax: 999}})).toEqual({en: `value > 999`, ru: `значение > 999`})
        expect(inputChecker({value: '2.002', rules: {valueMax: 2.001}})).toEqual({en: `value > 2.001`, ru: `значение > 2.001`})
        expect(inputChecker({value: '2.0001', rules: {valueMax: 2.001}})).not.toEqual({en: `value > 2.001`, ru: `значение > 2.001`})
        expect(inputChecker({value: '-0.001', rules: {valueMax: 0}})).not.toEqual({en: `value > 0`, ru: `значение > 0`})
        expect(inputChecker({value: 'abc', rules: {valueMax: 0}})).not.toEqual({en: `value > 0`, ru: `значение > 0`})
        expect(inputChecker({value: '', rules: {valueMax: 0}})).not.toEqual({en: `value > 0`, ru: `значение > 0`})
    })

    test('rules.exact', () => {
        expect(inputChecker({value: 'abcdef', rules: {exact: 'abcdefg'}})).toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: 'abcdef', rules: {exact: 'abcdeg'}})).toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: 'abcdef', rules: {exact: 'bcdef'}})).toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: 'abcdef', rules: {exact: 'bcdefg'}})).toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: '1.001', rules: {exact: '1'}})).toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: '', rules: {exact: ''}})).not.toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: '123', rules: {exact: '123'}})).not.toEqual({en: `doesn't match`, ru: `не совпадает`})
        expect(inputChecker({value: 'abc', rules: {exact: 'abc'}})).not.toEqual({en: `doesn't match`, ru: `не совпадает`})
    })


    test('rules.notExact', () => {
        expect(inputChecker({value: '123', rules: {notExact: '123'}})).toEqual({en: `shouldn't be 123`, ru: `не должно быть 123`})
        expect(inputChecker({value: 'abc', rules: {notExact: 'abc'}})).toEqual({en: `shouldn't be abc`, ru: `не должно быть abc`})
        expect(inputChecker({value: '   ', rules: {notExact: '   '}})).toEqual({en: `shouldn't be    `, ru: `не должно быть    `})
        expect(inputChecker({value: '  ', rules: {notExact: '   '}})).not.toEqual({en: `shouldn't be    `, ru: `не должно быть    `})
        expect(inputChecker({value: 'abc', rules: {notExact: 'abc '}})).not.toEqual({en: `shouldn't be    `, ru: `не должно быть    `})
        expect(inputChecker({value: 'abc', rules: {notExact: 'abd'}})).not.toEqual({en: `shouldn't be abd`, ru: `не должно быть abd`})
    })

    test('rules.type === numbers', () => {
        expect(inputChecker({value: '123 4', rules: {type: 'numbers'}})).toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '123 ', rules: {type: 'numbers'}})).toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '+123', rules: {type: 'numbers'}})).toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '-1', rules: {type: 'numbers'}})).toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: 'a123', rules: {type: 'numbers'}})).toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '23.2sw', rules: {type: 'numbers'}})).toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '', rules: {type: 'numbers'}})).not.toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '123', rules: {type: 'numbers'}})).not.toEqual({en: `numbers only`, ru: `только цифры`})       
        expect(inputChecker({value: '0', rules: {type: 'numbers'}})).not.toEqual({en: `numbers only`, ru: `только цифры`})       
    })


    test('rules.type === email', () => {
        expect(inputChecker({value: '1a@1.1', rules: {type: 'email'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: '@sad.abc', rules: {type: 'email'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: 'abcd@.abc', rules: {type: 'email'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: 'abcd@abc', rules: {type: 'email'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: 'abcd@abc.', rules: {type: 'email'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: 'abcd@abc.abc.', rules: {type: 'email'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: 'abcd@abc.s1', rules: {type: 'email'}})).not.toEqual({en: `wrong format`, ru: `неверный формат`})   
        expect(inputChecker({value: 'asd@1sad.abc', rules: {type: 'email'}})).not.toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: '1sdxf@1sad.abc', rules: {type: 'email'}})).not.toEqual({en: `wrong format`, ru: `неверный формат`})       
    })

    test('rules.type === phone', () => {
        expect(inputChecker({value: '++123', rules: {type: 'phone'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: 'a123', rules: {type: 'phone'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: '1a23', rules: {type: 'phone'}})).toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: '12+3', rules: {type: 'phone'}})).toEqual({en: `wrong format`, ru: `неверный формат`})    
        expect(inputChecker({value: '123', rules: {type: 'phone'}})).not.toEqual({en: `wrong format`, ru: `неверный формат`})       
        expect(inputChecker({value: '+123', rules: {type: 'phone'}})).not.toEqual({en: `wrong format`, ru: `неверный формат`})       
    })


    test('rules.type === date', () => {
        console.log(new Date('2032-06-12'));
        
        expect(inputChecker({value: '2022-01-32', rules: {type: 'date'}})).toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '2022-02-a', rules: {type: 'date'}})).toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '2030-01-02', rules: {type: 'date'}})).toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '2019-12-31', rules: {type: 'date'}})).toEqual({en: `wrong value`, ru: `неправильное значение`})       
        
        
        expect(inputChecker({value: '2020-01-02', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '2023-12-01', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '01-02-2021', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '01/02/2021', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '01.02.2021', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '2022-01-31', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
        expect(inputChecker({value: '2022-feb-01', rules: {type: 'date'}})).not.toEqual({en: `wrong value`, ru: `неправильное значение`})       
 
    })
})