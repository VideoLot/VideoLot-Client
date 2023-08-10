'use client'
import { useState } from "react";

export interface TextEditorProps {
    text?: string
    placeholder?: string
    apply: (value: string) => void;
}

export default function TextEditor(props: TextEditorProps) {
    const [isEditMode, setIsEditMode] = useState(false);

    const cancel = () => setIsEditMode(false);

    return (
        <div className="flex flex-col w-full" onClick={() => setIsEditMode(true)}>
            {isEditMode ? 
                <EditMode text={props.text || ''} apply={props.apply} cancel={cancel}/> : 
                <DisplayMode text={props.text || props.placeholder || ''}/>}
        </div>
    );
}

function DisplayMode({text}: {text: string}) {
    return (<div className="w-full cursor-text">{text}</div>);
}

function EditMode({text, apply, cancel}: {text: string, apply: (value: string) => void, cancel: () => void}) {
    const [value, setValue] = useState(text);
    return (
        <>
        <textarea onChange={(e)=>setValue(e.target.value)} cols={200} className="inline-block w-full">{value}</textarea>
        <div className="self-center space-x-2">
            <button onClickCapture={ () => apply(value) }>Apply</button>
            <button onClickCapture={ cancel }>Cancel</button>
        </div>
        </>
        
    );
}