'use client'

import Popup from "reactjs-popup";

export interface PopupProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: (...args: any)=> void;
}

export default function ViPopup(props: PopupProps) {
    return(
    <Popup open={props.isOpen} onClose={props.onClose}>
        <div className='bg-popup flex w-85vw md:w-96'>
            {props.children}
        </div>
    </Popup>);
}