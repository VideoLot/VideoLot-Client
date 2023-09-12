'use client'

import Popup from "reactjs-popup";

export interface PopupProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: (...args: any) => void;
}

export default function ViPopup(props: PopupProps) {
    return (       
            <Popup open={props.isOpen} onClose={props.onClose}>
                <div className='flex flex-col bg-popup max-w-85vw rounded-md'>
                    <div>
                        <button className='block ml-auto bg-closure-texture  bg-cover bg-center w-8 h-8'></button>
                    </div>
                    <div>
                        {props.children}
                    </div>
                </div>
            </Popup>
    );
}