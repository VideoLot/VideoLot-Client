export enum ArrowDirection {
    Right,
    Left,
    Top,
    Bottom
}

interface ArrowButtonProps {
    direction: ArrowDirection
    onClick?: ()=>void
}

export default function ArrowButton(props: ArrowButtonProps) {
    let transform;

    switch (props.direction) {
        case ArrowDirection.Right:
            break;
        case ArrowDirection.Left:
            transform = 'transform rotate-180';
            break;
        case ArrowDirection.Top:
            transform = 'transform rotate-270'
            break;
        case ArrowDirection.Bottom:
            transform = 'transform rotate-90'
    }

    return <button className={`bg-right-arrow-texture bg-center bg-cover w-full h-full ${transform}`}></button>
}