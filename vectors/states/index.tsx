export interface StateVectorProps {
    fill?: string;
    color?: string;
    congressional_districts?: Map<string, string>,
    handleClick: (districtName?: string) => any
}

export type StateCongressionalDistrictVectorProps = StateVectorProps & {
    congressional_districts?: Map<string, string>,
}

export interface CongressionalDistrictProps {
    fill?: string;
    color?: string;
    data?: any;
    handleClick: () => any
}

export const COLORS = {
    DEMOCRAT: '#4D76C7',
    REPUBLICAN: '#CF4949',
    NO_FILL: '#4D4D4D'
}

import { FC } from "react";
import Alaska from "./AK";
import Alabama from "./AL";
import Arkansas from "./AR";
import Arizona from "./AZ";
import California from "./CA";
import Colorado from "./CO";
import Connecticut from "./CT";
import DistrictOfColumbia from "./DC";
import Delaware from "./DE";
import Florida from "./FL";
import Georgia from "./GA";
import Hawaii from "./HI";
import Iowa from "./IA";
import Idaho from "./ID";
import Illinois from "./IL";
import Indiana from "./IN";
import Kansas from "./KS";
import Kentucky from "./KY";
import Louisiana from "./LA";
import Massachusetts from "./MA";
import Maryland from "./MD";
import Maine from "./ME";
import Michigan from "./MI";
import Minnesota from "./MN";
import Missouri from "./MO";
import Mississippi from "./MS";
import Montana from "./MT";
import NorthCarolina from "./NC";
import NorthDakota from "./ND";
import Nebraska from "./NE";
import NewHampshire from "./NH";
import NewJersey from "./NJ";
import NewMexico from "./NM";
import Nevada from "./NV";
import NewYork from "./NY";
import Ohio from "./OH";
import Oklahoma from "./OK";
import Oregon from "./OR";
import Pennsylvania from "./PA";
import RhodeIsland from "./RI";
import SouthCarolina from "./SC";
import SouthDakota from "./SD";
import Tennessee from "./TN";
import Texas from "./TX";
import Utah from "./UT";
import Virginia from "./VA";
import Vermont from "./VT";
import Washington from "./WA";
import Wisconsin from "./WI";
import WestVirginia from "./WV";
import Wyoming from "./WY";


export const STATE_CONGRESSIONAL_MAP = [
    Maine,
    Nebraska,
]

export const STATE_AT_LARGE_COMPONENTS = [
    Alaska,
    Alabama,
    Arizona,
    Arkansas,
    California,
    Colorado,
    Connecticut,
    Delaware,
    DistrictOfColumbia,
    Florida,
    Georgia,
    Idaho,
    Illinois,
    Indiana,
    Iowa,
    Hawaii,
    NewYork,
    Massachusetts,
    NewJersey,
    Montana,
    NorthDakota,
    NewHampshire,
    Maryland,
    Missouri,
    Minnesota,
    Michigan,
    Mississippi,
    Pennsylvania,
    NorthCarolina,
    Kentucky,
    Ohio,
    Oklahoma,
    Utah,
    Nevada,
    Oregon,
    Kansas,
    Louisiana,
    SouthDakota,
    SouthCarolina,
    NewMexico,
    RhodeIsland,
    Tennessee,
    Texas,
    Vermont,
    Virginia,
    Washington,
    WestVirginia,
    Wisconsin,
    Wyoming
]


export const STATE_NAMES = STATE_AT_LARGE_COMPONENTS.map(Component => Component.name);
export const STATE_CONGRESSIONAL_MAP_NAMES = STATE_CONGRESSIONAL_MAP.map(Component => Component.name);


// Create a map:
export const STATES = new Map<string, FC<StateVectorProps>>(STATE_NAMES.map((name, i) => [name, STATE_AT_LARGE_COMPONENTS[i]] as [string, FC<{}>]));

export const STATE_CONGRESSIONAL_DISTRICT_MAPS_2024 = new Map<string, FC<StateVectorProps>>(STATE_CONGRESSIONAL_MAP_NAMES.map((name, i) => [name, STATE_CONGRESSIONAL_MAP[i]] as [string, FC<{}>]));