'use server'

import { getPresidentialElection } from "@/components/NationalResults/getPresidentialElection";
import NationalResults from "@/components/NationalResults/NationalResults";
import { deriveServerSessionUser, getServerParamsAndSearchParams, ServerComponentChildren, TypicalServerProps } from "@/lib/Auth/getUser";

export type PresidentialElectionPageParams = TypicalServerProps<
    {
        year: string
    },
    {
        date?: string // YYYYMMDD
    }
>

export default async function Page(props: PresidentialElectionPageParams & ServerComponentChildren) {

    try {
        const params = await getServerParamsAndSearchParams(props);
        // const user = await deriveServerSessionUser();

        // if (!params.year) {
        //     return (
        //         <p>No presidential year identified.</p>
        //     )
        // }

        const focused = await getPresidentialElection(params.year);
        // const compared = await getPresidentialElection(String(Number(params.year) - 4));

        return (
            <div className="flex flex-col w-full h-full min-h-[100vh] bg-black text-white p-4 font-sans">

                <NationalResults
                    focused={focused}
                />
            </div>
        )
    }
    catch (err) {
        return (
            <p>An error occured.</p>
        )
    }

}


