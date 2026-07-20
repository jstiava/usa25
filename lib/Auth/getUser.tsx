'use server'

import { Sessions, Users } from "@/schema";
import { eq } from "drizzle-orm";
import { JSX } from "react/jsx-runtime";
import { cookies } from "next/headers";
import Drizzle from "../drizzle";

export default async function getSessionUser(sessionId: string | undefined) {
    const drizzle = await Drizzle.getInstance();

    if (!sessionId) {
        return null
    }

    const [theSession] = await drizzle.db.select().from(Sessions).where(
            eq(Sessions.id, sessionId)
        ).limit(1)

        if (!theSession) {
        return null
        }

        const [theUser] = await drizzle.db.select().from(Users).where(
            eq(Users.id, theSession.user_id)
        )

        const { passkey, ...theUserWithoutPasskey } = theUser;

        return theUserWithoutPasskey
}


/**
 * On a given url, params and searchParams would be supplied.
 */
export type TypicalServerProps<A, B> = {
    params: Promise<A>;
    searchParams: Promise<B>;
}

export type ServerComponentChildren = {
    children: JSX.Element
}

export type ProtectedCalendarParams = TypicalServerProps<
    {
        calendar: string
    },
    {
        date?: string // YYYYMMDD
    }
>


/**
 * Awaits and returns param and searchParams values together in a single json variable.
 * @param props 
 * @returns 
 */
export async function getServerParamsAndSearchParams<A, B>(props: TypicalServerProps<A, B>): Promise<A & B> {
    const paramsData = await props.params
    const searchParamsData = await props.searchParams

    return { ...paramsData, ...searchParamsData }
}


/**
 * On the server side or client side, look in cookies, find session id, and lookup the session and user.
 * @returns 
 */
export async function deriveServerSessionUser(): Promise<AppUserPublicType | null> {
    const sessionId = (await cookies()).get("session")?.value;

    if (!sessionId) {
        return null;
    }
    const theUser = await getSessionUser(sessionId)
    return theUser;
}

