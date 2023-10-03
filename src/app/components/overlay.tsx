'use client'

import { useElementSize } from '@/utils/hooks';
import { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

type Alignment = 'start' | 'center' | 'end';

interface OverlayProps {
    children: ReactNode
    foreground: ReactNode
    h: Alignment
    v: Alignment
}

export default function Overlay(props: OverlayProps) {
    const [pos, setPos] = useState<CSSProperties>();
    const [elementRef, elSize] = useElementSize();
    const [controlRef, ctrlSize] = useElementSize();

    useEffect(()=>{
        const newPos = {} as any;
        switch (props.h) {
            case 'start':
                newPos['left'] = '0px';
                break;
            case 'center':
                const offset = (elSize.width - ctrlSize.width) / 2;
                newPos['left'] = `${offset}px`
                break;
            case 'end':
                newPos['right'] = '0px';
                break;
        }

        switch (props.v) {
            case 'start':
                newPos['top'] = '0px';
                break;
            case 'center':
                const offset = (elSize.height - ctrlSize.height) / 2;
                newPos['top'] = `${offset}px`;
                break;
            case 'end':
                newPos['bottom'] = '0px';
                break;
        }
        setPos(newPos);
    }, [elSize, ctrlSize, props.h, props.v]);

    return <div ref={elementRef} className='relative'>
        <div ref={controlRef} style={pos} className={`absolute z-50`}>
            {props.foreground}
        </div>
        {props.children}
    </div>
}