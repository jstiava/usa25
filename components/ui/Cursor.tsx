import { JSX, useEffect, useState } from "react";
import useEventListener from "./useEventListener";


export default function Cursor({
    isOpen,
    children = <></>
}: {
    isOpen: boolean,
    children?: JSX.Element | null
}) {

    const [enabled, setEnabled] = useState(false);
    const [{ clientX, clientY }, setPosition] = useState({
        clientX: 0,
        clientY: 0
    });

    useEffect(() => {
        const media = window.matchMedia(
            "(pointer: fine) and (hover: hover) and (min-width: 1024px)"
        );

        const update = () => setEnabled(media.matches);

        update();
        media.addEventListener("change", update);

        return () => media.removeEventListener("change", update);
    }, []);

    useEventListener(
        "mousemove",
        ({ clientX, clientY }) => {
            if (enabled) {
                setPosition({ clientX, clientY });
            }
        },
        enabled ? window : undefined
    );

    if (!enabled || !children) {
        return null;
    }

    if (!clientX || !clientY) {
        return null;
    }

    return (
        <div
            style={{
                // backgroundColor: 'red',
                width: '0.5rem',
                height: '0.5rem',
                position: "fixed",
                pointerEvents: "none",
                top: `${clientY}px`,
                left: `${clientX}px`,
                zIndex: 1000
            }}
        >
            {isOpen && children && (
                <div
                    className="flex items-start justify-start"
                    style={{
                        width: "fit-content",
                        height: "fit-content",
                        position: 'absolute',
                        minWidth: "300px",
                        maxWidth: '100vw',
                        top: 0,
                        left: '1rem',
                        backgroundColor: '#3d3d3d',
                        borderRadius: '0.25rem'
                    }}>{children}</div>
            )}
        </div>
    )
}