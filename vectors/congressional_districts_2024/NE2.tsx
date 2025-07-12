import { COLORS, StateVectorProps } from "../states";


export default function Nebraska2(props: StateVectorProps) {

    const fill = props.fill ? props.fill : COLORS.NO_FILL;

    return (
        <path onClick={e => {
            e.stopPropagation();
            props.handleClick()
        }} id="Vector_4" d="M541.734 258.552L541.34 259.602L541.996 260.257L542.652 260.388L542.914 261.175L541.865 261.306L542.258 262.355L541.996 263.667L537.537 263.798V265.109L540.422 265.24V266.945H539.504L538.455 267.339L537.8 268.125L536.488 268.65L535.046 267.994L534.39 267.339L533.865 268.125H531.636V267.339H523.112L523.243 261.044L523.375 256.848L524.948 257.11L526.391 256.979L527.309 257.503L529.669 257.372L531.243 258.421H534.259L541.734 258.552Z" fill={fill} stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    )
}