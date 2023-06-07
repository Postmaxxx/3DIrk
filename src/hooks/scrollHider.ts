import { useCallback, useState, useEffect } from 'react';


export const useScrollHider = () => {

    const [_el, setElement] = useState<HTMLElement | null>(null)
    const [threshold, setThreshold] = useState<number>(0)

    const onScroll = useCallback(() => {
        if (!_el) return
        if (document.body.scrollTop > threshold || document.documentElement.scrollTop > threshold) {
            _el.classList.add('scrolled')
        } else {
            _el.classList.remove('scrolled')
        }
    }, [_el, threshold])


    const add = (_newEl: HTMLElement, threshold: number) => {
        setElement(_newEl)
        setThreshold(threshold)
    }

    const remove = () => {
        setElement(null)
        setThreshold(0)
        document.removeEventListener('scroll', onScroll)
    }

    
    useEffect(() => {
        document.addEventListener('scroll', onScroll)
        return () => document.removeEventListener('scroll', onScroll)
    }, [_el])

    return {add, remove}
}

