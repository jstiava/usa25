"use client"
import { useState } from "react";
import { COLORS, STATE_CONGRESSIONAL_DISTRICT_MAPS_2024, STATE_CONGRESSIONAL_MAP_NAMES, STATE_NAMES, STATES } from "./states";
import RedElephantPuckIcon from "@/components/RedElephantPuckIcon";
import BlueDonkeyPuckIcon from "@/components/BlueDonkeyPuckIcon";
import { ExampleCombobox } from "@/components/ui/Combobox";
import { Button } from "@/components/ui/button";


export interface Pres50_2024_Props {
    states: any
}

export interface MapMode {
    key: 'rotate' | 'paint',
    color?: string
}

export default function Pres50_2024(props: Pres50_2024_Props) {

    const [mode, setMode] = useState<MapMode>({
        key: 'rotate',
    });

    const [colors, setColors] = useState(new Map<string, string>());

    const rotateColor = (color: string) => {
        switch (color) {
            case COLORS.DEMOCRAT:
                return COLORS.REPUBLICAN;
            case COLORS.REPUBLICAN:
                return COLORS.NO_FILL;
            case COLORS.NO_FILL:
                return COLORS.DEMOCRAT;
            default:
                return COLORS.NO_FILL;
        }
    }

    const handleClick = (stateName: string) => {

        console.log({
            stateName,
            colors
        })

        const identifier = stateName;

        if (mode.key === 'rotate') {
            setColors(prev => {
                const newMap = new Map(prev);
                const before = newMap.get(identifier) || COLORS.NO_FILL;
                const rotated = rotateColor(before);
                newMap.set(identifier, rotated);
                return newMap;
            });
        }
        else if (mode.key === 'paint') {

            const color = mode.color;
            if (!color) {
                console.log("Something went wrong.")
                return;
            }
            setColors(prev => {
                const newMap = new Map(prev);
                const before = newMap.get(identifier) || COLORS.NO_FILL;
                newMap.set(identifier, before === color ? COLORS.NO_FILL : color);
                return newMap;
            });
        }
    }

    return (
        <div className="column" style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <ExampleCombobox />
            <Button >Help this is a button.</Button>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center",
                gap: "1rem"
            }}>
                <div className="flex">
                    <RedElephantPuckIcon />
                    <h6>Republicans</h6>
                </div>
                <div className="flex">
                    <BlueDonkeyPuckIcon />
                    <h6>Democrats</h6>
                </div>
            </div>
            
            <svg width="1082" height="658" viewBox="0 0 1082 658" fill="none" xmlns="http://www.w3.org/2000/svg">

                <g id="Group 150">
                    {STATE_NAMES.map((stateName, i) => {

                        const Component = STATES.get(stateName);
                        const color = colors.get(stateName);

                        if (!Component) {
                            return null;
                        }

                        return (
                            <Component
                                key={Component.name}
                                fill={color}
                                handleClick={() => handleClick(stateName)}
                            />
                        )
                    })}

                    {STATE_CONGRESSIONAL_MAP_NAMES.map((stateName, i) => {

                        const Component = STATE_CONGRESSIONAL_DISTRICT_MAPS_2024.get(stateName);
                        const color = colors.get(stateName);

                        const stateDistrictsMap = new Map(Array.from(colors.entries()).filter(([key]) =>
                            key.startsWith(stateName) && key != stateName
                        ));

                        console.log(stateDistrictsMap)


                        if (!Component) {
                            return null;
                        }

                        return (
                            <Component
                                key={Component.name}
                                fill={color}
                                congressional_districts={stateDistrictsMap}
                                handleClick={(districtName) => {
                                    if (!districtName) {
                                        handleClick(Component.name);
                                        return;
                                    }
                                    handleClick(districtName)
                                }}
                            />
                        )
                    })}

                </g>
            </svg>
            <div style={{
                marginTop: '2rem'
            }}>
                {mode.key === 'paint' && (
                    <div>

                        {mode.color && (
                            <input
                                type="color"
                                value={mode.color}
                                onChange={(e) => setMode(prev => ({ ...prev, color: e.target.value }))}
                            />
                        )}
                        <button onClick={() => setMode({
                            key: 'rotate'
                        })}>Click to toggle to rotate</button>
                    </div>
                )}
                {mode.key === 'rotate' && (
                    <div>
                        <button onClick={() => {
                            setMode({
                                key: 'paint',
                                color: '#4D76C7'
                            })
                        }}>Click to toggle to paint</button>
                    </div>
                )}
            </div>
        </div>
    );
}
