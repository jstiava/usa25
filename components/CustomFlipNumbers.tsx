"use client"
import { ComponentProps } from "react";
import FlipNumbers from "react-flip-numbers";
import { cn } from "@/lib/utils"


export default function CustomFlipNumbers(props: Partial<ComponentProps<typeof FlipNumbers>> & {
    value: string
}) {


    const initialProps: ComponentProps<typeof FlipNumbers> = {
        play: true,
        color: '#fff',
        background: "#33333300",
        width: props.width || 28,
        height: props.height || 50,
        nonNumberStyle: {
            zIndex: 1,
            ...props.nonNumberStyle
        },
        numbers: "0",
        numberStyle: {
            fontFamily: 'var(--font-mono)',
            color: "#fff",
            textTransform: 'uppercase',
            fontWeight: 800,
            fontSize: "2.6rem",
            lineHeight: '115%',
            padding: 0,
            margin: 0,
            ...props.numberStyle
        },
        nonNumberClassName: cn(`flip-numbers-wrapper`, props.nonNumberClassName)
    }

    return (
        <FlipNumbers
            {...initialProps}
            numbers={props.value || '0'}
        />
    )
}