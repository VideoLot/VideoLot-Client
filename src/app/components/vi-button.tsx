
export enum ViButtonColor {
    Blue = 'bg-blue-300',
    SemiBlue = 'bg-blue-100',
    Red = 'bg-red-300',
    SemiRed = 'bg-red-100'
}

interface ViButtonProps {
    onClick?: () => void
    color?: ViButtonColor 
    children?: React.ReactNode
}

export default function ViButton(props : ViButtonProps) {
    return <button className={`rounded-md ${props.color || ViButtonColor.Blue}`} onClick={props.onClick}>{props.children}</button>
}