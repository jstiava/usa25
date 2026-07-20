'use client'

import { useState } from "react";
import { NationalResultsProps } from "./getPresidentialElection";
import NationalMap from "./NationalMap";


const INITIAL_VISUAL_OPTIONS = [
    { value: 'statewide_victor', label: "Statewide Winner" },
    { value: 'strength_of_victory', label: 'Strength of Victory' },
    { value: 'turnout', label: 'Turnout' },
]




export default function NationalResults(props: NationalResultsProps) {

    const [mode, setMode] = useState<any | null>({
        key: 'rotate',
        visual: 'statewide_victor',
        coverage: 'state',
        isHypothetical: false,
        zoomInTo: null
    });

    const [hovering, setHovering] = useState<string | null>(null);
    const [score, setScore] = useState<any | null>(new Map<string, number>());
    const [colors, setColors] = useState(new Map<string, string>());

    const handleClickOnMapTarget = (name: string) => {
        // TODO
        return;
    }

    // if (!props.focused) {
    //     return <p>Focused not loaded yet.</p>;
    // }

    return (
        <div className="flex flex-col w-full items-start">

            <h3 className="text-4xl font-bold tracking-tight">{props.focused.year} Presidential Election</h3>
            <NationalMap
                svgProps={{
                    fill: "transparent",
                    viewBox: "0 0 850 507",
                    preserveAspectRatio: "xMidYMid meet",
                    className: "w-full",
                    width: "100%",
                    style: {
                        height: "auto",
                        maxHeight: "80vh"
                    },
                }}
                mode={mode}
                setMode={setMode}
                colors={colors}
                focused={props.focused}
                comparison={props.comparison}
                onClick={(e, stateName) => handleClickOnMapTarget(stateName)}
                hovering={hovering}
                setHovering={setHovering}
            />
        </div>
    )

}
