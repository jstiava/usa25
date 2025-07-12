import { useState } from "react";
import CaseStudyBlock from "./CaseStudyBlock";




export default function Header() {

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    return (
        <div className="column">
            {isSmallScreen && (
                <Menu />
            )}
        </div>
    )
}