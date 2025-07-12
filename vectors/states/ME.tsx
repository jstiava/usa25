import { COLORS, StateCongressionalDistrictVectorProps, StateVectorProps } from ".";
import Maine1 from "../congressional_districts_2024/ME1";
import Maine2 from "../congressional_districts_2024/ME2";

export const ME_CONGRESSIONAL_DISTRICTS_2024 = [
    Maine1,
    Maine2
]

export default function Maine(props: StateCongressionalDistrictVectorProps) {

    const fill = props.fill ? props.fill : COLORS.NO_FILL;


    return (
        <>
            <g id="ME_group" onClick={() => props.handleClick()} style={{
                cursor: 'pointer'
            }}>

                <g id="ME" style={{
                    position: 'relative'
                }}>
                   {ME_CONGRESSIONAL_DISTRICTS_2024.map((Component, i) => {
                        const districtFill = props.congressional_districts ? props.congressional_districts.get(Component.name) || fill : fill;
                        return (
                            <Component key={Component.name} handleClick={() => props.handleClick(Component.name)} fill={districtFill} />
                        )
                    })}
                    

                </g>
                {/* <g id="Frame 180">
                <g id="Frame 176_2">
                <rect width="11" height="12" transform="translate(1000 85)" fill={fill} />
                <path id="3" d="M1005.53 96.7388C1004.13 96.7388 1003.04 96.4254 1002.28 95.7986C1001.52 95.1619 1001.12 94.2764 1001.07 93.1423L1004.04 93.0527C1004.09 93.5004 1004.23 93.8387 1004.47 94.0675C1004.72 94.2864 1005.07 94.3958 1005.53 94.3958C1005.82 94.3958 1006.07 94.3511 1006.28 94.2615C1006.49 94.162 1006.65 94.0277 1006.75 93.8586C1006.87 93.6795 1006.93 93.4756 1006.93 93.2467C1006.93 92.8687 1006.8 92.5802 1006.53 92.3812C1006.26 92.1723 1005.89 92.0678 1005.41 92.0678H1004.38V90.0979H1005.41C1005.75 90.0979 1006.03 90.0183 1006.26 89.8592C1006.5 89.7 1006.62 89.4363 1006.62 89.0682C1006.62 88.7598 1006.53 88.5061 1006.35 88.3071C1006.17 88.1082 1005.87 88.0087 1005.44 88.0087C1005.01 88.0087 1004.69 88.1032 1004.47 88.2922C1004.26 88.4812 1004.13 88.7101 1004.08 88.9787L1001.16 88.8444C1001.27 87.8694 1001.7 87.0984 1002.44 86.5313C1003.19 85.9542 1004.19 85.6657 1005.44 85.6657C1006.36 85.6657 1007.12 85.7901 1007.74 86.0388C1008.36 86.2776 1008.82 86.6258 1009.13 87.0834C1009.45 87.5411 1009.61 88.0833 1009.61 88.7101C1009.61 89.3169 1009.4 89.8293 1008.98 90.2472C1008.56 90.6551 1007.98 90.9287 1007.23 91.0679V90.8292C1008.12 90.9784 1008.79 91.2818 1009.25 91.7395C1009.7 92.1872 1009.93 92.7791 1009.93 93.5154C1009.93 94.1819 1009.75 94.759 1009.4 95.2464C1009.05 95.724 1008.55 96.0921 1007.89 96.3508C1007.23 96.6094 1006.45 96.7388 1005.53 96.7388Z" fill="white" />
                </g>
                <g id="Frame 177_2">
                    <rect width="8" height="12" transform="translate(1014 85)" fill={fill} />
                    <path id="1" d="M1017.22 96.5V90.1129H1014.86V88.0833H1015.79C1016.27 88.0833 1016.66 88.0186 1016.95 87.8893C1017.25 87.75 1017.47 87.5212 1017.61 87.2028C1017.75 86.8845 1017.82 86.4517 1017.82 85.9045H1020.15V96.5H1017.22Z" fill="white" />
                    </g>
                    </g> */}
                <path d="M1001.1 81.7552V71.1597H1004.95L1007.19 77.89L1009.42 71.1597H1013.27V81.7552H1010.35V75.7859L1008.21 81.7104H1006.14L1004.02 75.7859V81.7552H1001.1Z" fill="white" />
                <path d="M1014.98 81.7552V71.1597H1022.83V73.5026H1017.91V75.2785H1022.66V77.6065H1017.91V79.4122H1022.95V81.7552H1014.98Z" fill="white" />
            </g>
        </>
    )
}