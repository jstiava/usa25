'use client'
import SVGReactComponent from "@/components/SvgReactComponent";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useRouter, useSearchParams } from "next/navigation";
import { divisions } from "@/schema";
import { NationalResultsProps } from "./getPresidentialElection";
import { getReadableTextColor } from "@/lib/visual_helpers";
import { StateLabelWrapper } from "./StateLabelWrapper";
import Cursor from "../ui/Cursor";

export interface NationalMapProps {
    svgProps?: any,
    colors: Map<string, string>
    focused: NationalResultsProps["focused"],
    comparison: NationalResultsProps["comparison"],
    onClick: (e: MouseEvent<any>, stateName: string) => any,
    mode: any,
    setMode: Dispatch<SetStateAction<any>>,
    hovering: string | null,
    setHovering: any
}

export default function NationalMap({
    svgProps = {},
    colors,
    focused,
    comparison,
    onClick,
    mode,
    setMode,
    hovering,
    setHovering,
}: NationalMapProps) {

    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
    const [renderedStates, setRenderedStates] = useState<Map<string, any> | null>(null);
    const [theStates, setTheStates] = useState<NationalResultsProps['focused']['states'] | null>(null);
    const [labels, setLabels] = useState<Map<string, any> | null>(null);

    const [lines, setLines] = useState<string | null>(null);
    const [census, setCensus] = useState<any | null>(null);

    const zoomToElement = async (e: React.MouseEvent<SVGElement, MouseEvent>, stateName: string) => {
        // TODO
        return;
    }

    useEffect(() => {

        const newStatesMap = new Map()
        const newLabels = new Map();
        for (const state of focused.states) {
            if (state.shape) {
                const Component = SVGReactComponent(state.shape)
                newStatesMap.set(state.abbr, Component);
            }
            if (state.label) {
                const ComponentLabel = SVGReactComponent(state.label);
                newLabels.set(state.abbr, ComponentLabel);
            }
        }


        setRenderedStates(newStatesMap);
        setLabels(newLabels);
        setTheStates(focused.states);

        const newCountiesMap = new Map()
        // for (const county of focused.counties) {
        //     if (county.shape) {
        //         const Component = SVGReactComponent(county.shape)
        //         newCountiesMap.set(county.name, Component);
        //     }
        // }

        // setRenderedCounties(newCountiesMap);
        // setTheCounties([]);


        fetch(`/maps/us_state_borders.svg`)
            .then(res => res.text())
            .then(text => {
                setLines(text);
            })
    }, []);

    if (!renderedStates || !labels || !lines) {
        return null;
    }


    if (!theStates) {
        return <p>NationalMap: No states present.</p>
    }

    return (
        <div className="flex relative w-full">
            <Cursor isOpen={Boolean(hovering)} key={hovering} >
                <>
                    <>
                        {hovering && mode.coverage === 'state' ? (
                            (() => {
                                const state = focused.states.find(x => x.abbr === hovering);
                                const color = colors.get(hovering);
                                const turnout = state && census ? Number(state.total) / Number(census.get(hovering)) : null;
                                if (!state) {
                                    return null;
                                }

                                return (
                                    <p>{state.name} card</p>
                                )
                            })()
                        ) : null}
                    </>
                    {hovering ? (
                        (() => {
                            const theCounty = focused.counties?.find(x => x.division === hovering);
                            const state = theStates.find(x => x.fid === String(theCounty?.fid).slice(0, 2));
                            let victor = null;
                            if (!theCounty || !victor) {
                                return null;
                            }
                            return (
                                <p>County card</p>
                            )
                        })()
                    ) : null}
                </>
            </Cursor>
            <TransformWrapper
                minScale={0.5}
                maxScale={10}
                initialScale={1}
                ref={transformComponentRef}
                doubleClick={{ disabled: true }}
                wheel={{ disabled: true }}
            >
                {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
                    <TransformComponent
                        wrapperStyle={{
                            width: "100%",
                            maxHeight: "100vh"
                        }}
                        contentStyle={{
                            width: '100%',
                            paddingTop: "3rem",
                            maxHeight: "100vh"
                        }}
                    >
                        <svg {...svgProps}>
                            {Array.from(renderedStates.entries()).map(([stateName, Component]) => {

                                const StateLabel = labels.get(stateName);
                                let color = colors.get(stateName);

                                const focusedState = focused.states.find(x => x.abbr === stateName);

                                const allMatchingStates = focused.states.filter(x => x.abbr.startsWith(stateName))

                                const comparedState = comparison?.states.find(x => x.abbr === stateName);

                                let isFlipped = color && comparedState ? false : false;

                                if (mode.zoomInTo === stateName) {
                                    return null;
                                }


                                return (
                                    <g
                                        key={stateName}
                                        className="cursor-pointer"
                                        onMouseEnter={e => {
                                            if (mode.coverage === 'county') {
                                                return;
                                            }
                                            setHovering(stateName)
                                        }}
                                        onMouseLeave={e => {
                                            if (mode.coverage === 'county') {
                                                return;
                                            }
                                            setHovering(prev => {
                                                if (prev === hovering) {
                                                    return null;
                                                }
                                                return prev;
                                            })
                                        }}
                                    >
                                        {!focusedState || !focusedState.labelAsSelector && (
                                            <Component
                                                key={`${stateName}_core`}
                                                fill={color ?? "#2d2d2d"}
                                            />
                                        )}

                                        {/* {isFlipped && (
                                                <Component
                                                    key={`${stateName}_flipped`}
                                                    fill={'url(#pattern0_89_8131)'}
                                                    stroke="none"
                                                    style={{
                                                        pointerEvent: 'none'
                                                    }}
                                                />
                                            )} */}

                                        {StateLabel && (
                                            <StateLabelWrapper
                                                key={`${stateName}_label`}
                                                component={
                                                    <StateLabel
                                                        fill={color ? getReadableTextColor(color) : '#fff'}
                                                    />
                                                }
                                                behind={(bbox) => {
                                                    return (
                                                        <g transform="translate(-12, -8)">
                                                            {!focusedState || focusedState.labelAsSelector && (
                                                                <rect
                                                                    x={bbox.x}
                                                                    y={bbox.y}
                                                                    width={24}
                                                                    height={28}
                                                                    fill={color ?? "#202020"}
                                                                >
                                                                </rect>
                                                            )}
                                                            <text
                                                                x={bbox.x + 12}
                                                                y={bbox.y + 24}
                                                                text-anchor="middle"
                                                                alignment-baseline="middle"
                                                                fill={color ? getReadableTextColor(color) : '#fff'}
                                                                font-size="11"
                                                                style={{
                                                                    fontFamily: 'var(--default-font-family)',
                                                                    fontWeight: 700
                                                                }}
                                                            >{allMatchingStates && allMatchingStates.length > 1 ? allMatchingStates.reduce((acc, curr) => {
                                                                if (curr.coverage === 'us_cd') {
                                                                    return acc + 1;
                                                                }
                                                                return acc + curr.weight
                                                            }, 0) : focusedState?.weight ?? ""}</text>
                                                        </g>
                                                    )
                                                }}
                                            // inFront={(bbox) => (
                                            //     <circle
                                            //         cx={bbox.x + bbox.width / 2}
                                            //         cy={bbox.y + bbox.height / 2}
                                            //         r={5}
                                            //         fill="red"
                                            //     />
                                            // )}
                                            />

                                        )}

                                    </g>
                                )
                            })}

                            {lines && (() => {
                                const Component = SVGReactComponent(lines)
                                return <Component key="lines" style={{
                                    pointerEvents: 'none'
                                }} />
                            })()}

                            {Array.from(renderedStates.entries()).map(([stateName, Component]) => {
                                if (mode.zoomInTo === stateName) {
                                    return null;
                                }

                                if (stateName === 'District of Columbia' && ['Maryland', 'Virginia'].some(x => x === mode.zoomInTo)) {
                                    return null;
                                }
                                return (
                                    <Component
                                        className="cursor-pointer"
                                        key={`${stateName}_hovering`}
                                        // style={{ pointerEvents: 'none' }}
                                        fill="transparent"
                                        stroke={hovering === stateName ? 'white' : 'transparent'}
                                        strokeWidth={1.5}
                                        onClick={e => {

                                            console.log({
                                                e,
                                                mode,
                                                stateName
                                            })
                                            if (!mode.visual) {
                                                onClick(e, stateName)
                                                return;
                                            }
                                            else if (mode.visual != 'statewide_victor') {
                                                zoomToElement(e, stateName)
                                                return;
                                            }
                                            onClick(e, stateName)
                                        }}
                                        onMouseEnter={e => {
                                            setHovering(stateName)
                                        }}
                                        onMouseLeave={e => {
                                            setHovering(prev => {
                                                if (prev === stateName) {
                                                    return null;
                                                }
                                                return prev;
                                            })
                                        }}
                                    />
                                )
                            })}

                            <defs>

                                <pattern
                                    xmlns="http://www.w3.org/2000/svg"
                                    id="pattern0_89_8131"
                                    patternUnits="userSpaceOnUse"
                                    width="10"
                                    height="10"
                                >
                                    <use
                                        xlinkHref="#image0_89_8131"
                                        x="0"
                                        y="0"
                                        width="10"
                                        height="10"
                                        opacity="0.5"
                                    />
                                </pattern>

                                {/* <pattern xmlns="http://www.w3.org/2000/svg" id="pattern0_89_8131" patternContentUnits="objectBoundingBox" width="0.0581556" height="0.0498002">
                        <use xlinkHref="#image0_89_8131" xmlnsXlink="http://www.w3.org/1999/xlink" transform="scale(0.000726945 0.000622502)" />
                    </pattern> */}
                                <image xmlns="http://www.w3.org/2000/svg" id="image0_89_8131" width="10" height="10" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF4SURBVHgB7dBJTgRREANR3xzfvKGRQAw9VfkPsXBIznXqSezePnYBzwJXvKDiBRUvqHhBxQsqXlDxgooXVLyg4gUVL6h4QcULKl5Q8YKKF1S8oOIFFS+oeEHFCypeUPGCihdUvKDiBRUvqHhBxQsqXlDxgooXVLyg4gUVL6h4QcULKl5Q8cKKd7636yneua541z+Ld6IvPCSgxe4nHg7QYvcXDwVosbuFhwG02N3DQwBa7B7hbQe02D3D2wposXsFbxugxe5VvC2AFrsjeMsBLXZH8ZYCWuzO4C0DtNidxVsCaLFL8KYDWuxSvKmAFrsReNMALXaj8KYAWuxG4g0HtNiNxhsKaLGbgTcM0GI3C28IoMVuJl4MaLGbjRcBWuxW4J0GtNitwjsFaLFbiXcY0GK3Gu8QoMVuB97LgBa7XXgvAVrsduI9BbTY7cZ7CGixI+DdBbTYUfBuAlrsSHj/AC12NLxfgBY7It43oMWOivcJaLEj413eAVutdDVuxUsFAAAAAElFTkSuQmCC" xmlnsXlink="http://www.w3.org/1999/xlink" />
                            </defs>


                        </svg>
                    </TransformComponent>
                )}
            </TransformWrapper>
        </div>
    )
}