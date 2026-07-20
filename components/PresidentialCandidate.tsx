"use client"
import BlueDonkeyPuckIcon from "./BlueDonkeyPuckIcon";
import RedElephantPuckIcon from "./RedElephantPuckIcon";
import { ComponentType, JSX, MouseEvent } from "react";
import CustomFlipNumbers from "./CustomFlipNumbers";
import IndependentPuck from "./IndependentPuck";
import { PresidentialElection_CandidatesRow } from "./NationalResultsV2/NationalResults";

export const COLORS = {
    DEMOCRAT: '#4D76C7',
    REPUBLICAN: '#CF4949',
    NO_FILL: '#4D4D4D'
}

export const CANDIDATE_DEFAULTS_BY_PARTY: Record<string, { color: string, Icon: ComponentType<{ size?: number }> }> = {
    'democratic': {
        color: COLORS.DEMOCRAT,
        Icon: BlueDonkeyPuckIcon
    },
    'republican': {
        color: COLORS.REPUBLICAN,
        Icon: RedElephantPuckIcon
    },
    'independent': {
        color: '#3d3d3d',
        Icon: IndependentPuck
    },
    'reform': {
        color: '#8d32a8',
        Icon: IndependentPuck
    }
}

export const getColorOf = (target: string) => {

    let value = COLORS.NO_FILL;
    switch (target) {
        case 'gop':
            value = COLORS.REPUBLICAN;
            break;
        case 'republican':
            value = COLORS.REPUBLICAN;
            break;
        case 'dem':
            value = COLORS.DEMOCRAT;
            break;
        case 'democratic':
            value = COLORS.DEMOCRAT;
            break;

    }

    return String(value)

}


export default function PresidentialCandidate({
    candidate,
    total_vote,
    score,
    isWinner = false,
    selected = false,
    onClick
}: {
    candidate: PresidentialElection_CandidatesRow,
    total_vote: number,
    score: number,
    isWinner: boolean,
    selected?: boolean,
    onClick?: (e: MouseEvent<any>, color: string) => any,
}) {

    const defaultParty = CANDIDATE_DEFAULTS_BY_PARTY[candidate.party];

    return (
        <button className="flex items-center justify-between w-full cursor-pointer"
            onClick={(e) => {
                if (onClick) {
                    onClick(e, defaultParty.color)
                }
            }}
            style={isWinner ? {
                backgroundColor: defaultParty.color,
                color: '#fff'
            } : {
                backgroundColor: 'transparent',
                color: '#fff'
            }}
        >
            <div className="flex gap-2 w-fit items-center">
                {defaultParty && defaultParty.Icon && (
                    <div style={{
                        borderRadius: '100vh',
                        width: "fit-content",
                        height: "fit-content",
                        border: '2px solid',
                        borderColor: selected ? 'white' : 'transparent'
                    }}>
                        <defaultParty.Icon size={24} />
                    </div>
                )}
                <h3 className="uppercase font-black" style={{
                    fontSize: "1.5rem"
                }}>{candidate.lastname || "missing"}</h3>
            </div>

            <div className="flex gap-2 items-center">
                {total_vote && <h3 className="font-mono" style={{
                    fontSize: "1.5rem",
                    lineHeight: "100%",
                    paddingTop: "0.15rem",
                    verticalAlign: "middle"
                }}>{total_vote.toLocaleString()}</h3>}

                <div className="flex" style={{
                    paddingLeft: "1rem"
                }}>

                    <CustomFlipNumbers
                        value={String(score)}
                        width={16}
                        height={32}
                        numberStyle={{
                            fontSize: "1.5rem"
                        }}
                    />
                </div>
            </div>

        </button>
    )

}