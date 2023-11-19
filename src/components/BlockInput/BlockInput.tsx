import { TLang, TLangText } from "src/interfaces"
import { IInputChecker, inputChecker } from "../../assets/js/processors"
import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import './block-input.scss'

interface IBlockInput {
	lang: TLang
	labelText: TLangText
	id: string
	inputType?: "text" | "tel" | "email" | "date" | "password"
	typeElement?: "input" | "textarea" | "select"
	rules: IInputChecker["rules"]
	required?: boolean
	expandable?: boolean
	initialValue?: string
	onChange?: (newValue: string) => void
	children?: JSX.Element | JSX.Element[]
}

export interface IBlockInputFunctions {
    getValue: () => string | undefined
    setValue: (value: string) => void
    getError: () => {
		error: TLangText | null,
		name: TLangText 
	}
	getErrorText: (lng: TLang) => string | null
}

const BlockInput = forwardRef<IBlockInputFunctions, IBlockInput>(({lang, labelText, onChange, id, inputType="text", typeElement='input', required, expandable=false, initialValue, rules, children}, ref) => {
    useImperativeHandle(ref, () => ({
        getValue() {
			let result;
			if (typeElement === 'input') {
				result = _input.current?.value 
			}
			if (typeElement === 'textarea') {
				result = _textarea.current?.value 
			}
            return result
        },
		setValue(value) {
			if (typeElement === 'input') {
				_input.current && (_input.current.value = value);
			} 
			if (typeElement === 'textarea') {
				_textarea.current && (_textarea.current.value = value);
			}
        },
		getError() {
			let err: TLangText | null = null;
			if (typeElement === 'input' && _input.current) {
				err = checkOnErrors(_input.current.value)
			} 
			if (typeElement === 'textarea' && _textarea.current) {
				err = checkOnErrors(_textarea.current.value)
			} 
			return {error: err, name: labelText}
		},
		getErrorText(lng) {
			if (typeElement === 'input' && _input.current) {
				const err = checkOnErrors(_input.current.value)
				return err ? `${labelText[lng]}: ${err[lng]}` : null
			} 
			if (typeElement === 'textarea' && _textarea.current) {
				const err = checkOnErrors(_textarea.current.value)
				return err ? `${labelText[lng]}: ${err[lng]}` : null
			} 
			return null
		}
    }));

	const [error, setError] = useState<TLangText | null>(null)
	const _input = useRef<HTMLInputElement | null>(null)
	const _textarea = useRef<HTMLTextAreaElement | null>(null)

    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e): void => {
		setError(null)
		onChange && onChange(e.target.value)
    }

	const checkOnErrors = (value: string): TLangText | null => {
		const errText = inputChecker({value, rules})
		setError(errText)
		return errText
	}

    const onBlurInput: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e): void => {
		checkOnErrors(e.target.value)
    }

	useEffect(() => {
		if (_input.current && (typeof initialValue !== 'undefined')) {
			_input.current.value = initialValue
		}
		if (_textarea.current && (typeof initialValue !== 'undefined')) {
			_textarea.current.value = initialValue
		}
	}, [initialValue, _input.current, _textarea.current])

	return (
		<div className={`block_input ${error ? "incorrect-value" : ""} ${expandable ? 'expandable' : ''}`} data-selector="input-block">
			<label htmlFor={id}>{labelText[lang]}{required && '*'}</label>
			{typeElement === 'input' &&
				<input 
					ref={_input}
					data-selector="input"
					aria-describedby={`${id}_error`}
					className="input-element" 
					id={id} 
					type={inputType} 
					onChange={onChangeText}
					onBlur={onBlurInput}
				/>}
			{typeElement === 'textarea' &&
				<textarea 
					ref={_textarea}
					data-selector="input"
					aria-describedby={`${id}_error`}
					className="input-element" 
					//wrap='hard'
					id={id}
					onChange={onChangeText}
					onBlur={onBlurInput}
				/>}
			{error && <span id={`${id}_error`} aria-description={lang === 'en' ? 'Error text' : 'Текст ошибки'} data-content="errorText">{lang === 'en' ? 'Error: ' : 'Ошибка: '}{error[lang]}</span>}	
		</div>
	)
})



export default BlockInput