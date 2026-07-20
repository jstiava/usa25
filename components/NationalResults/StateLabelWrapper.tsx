import { cloneElement, useEffect, useRef, useState } from "react";

type StateLabelWrapperProps = {
    component: React.ReactElement; // You pass in <StateLabel />
    behind?: (bbox: DOMRect) => React.ReactNode;
    inFront?: (bbox: DOMRect) => React.ReactNode;
};


export function StateLabelWrapper({ component, behind, inFront }: StateLabelWrapperProps) {
    const ref = useRef<SVGGraphicsElement>(null);
    const [center, setCenter] = useState<{ x: number; y: number; bbox: DOMRect } | null>(null);

    useEffect(() => {
        if (ref.current) {
            const bbox = ref.current.getBBox();
            setCenter({
                x: bbox.x + bbox.width / 2,
                y: bbox.y + bbox.height / 2,
                bbox,
            });
        }
    }, [component]);

    return (
        <>
            {center && behind?.(center)}
            {cloneElement(component, { ref })}
            {center && inFront?.(center)}
        </>
    );
}