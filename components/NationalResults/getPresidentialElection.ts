import Drizzle from "@/lib/drizzle";
import { eq, and, sql, getTableColumns } from "drizzle-orm";
import { divisions, people, races, results, tickets, visual_to_division } from "@/schema";
import { alias } from "drizzle-orm/pg-core";


export type PresidentialElectionProps = {
    states: {
        id: number | null;
        name: string | null;
        abbr: string | null;
        coverage: string | null;
        shape: string | null;
        label: string | null;
        tickets: Record<string, {
            votes: number;
            source: string | null;
            isTotal: boolean;
        }>;
        total: number | null;
        victor?: number;
    }[],
    candidates: (typeof tickets.$inferSelect & {
        person: typeof people.$inferSelect | null
        runningMate: typeof people.$inferSelect | null
    })[],
    totals?: {
        id: number | null;
        name: string | null;
        abbr: string | null;
        coverage: string | null;
        tickets: Record<string, {
            votes: number;
            source: string | null;
            isTotal: boolean;
        }>;
        victor: number | null;
        total: number
    }[] | null,
    year: string,
    counties: any[],
    races: (typeof races.$inferSelect & {
        total: {
            id: number,
            votes: number | null,
            source: string,
            division: string
        }
    })[],
}

export interface NationalResultsProps {
    focused: PresidentialElectionProps,
    comparison: PresidentialElectionProps | null
}




export const getPresidentialElection = async (year: string): Promise<PresidentialElectionProps | null> => {

    if (Number(year) < 1976) {
        return null;
    }

    const drizzle = await Drizzle.getInstance();

    console.log("get states")
    const states_raw = await drizzle.db
        .select({
            id: divisions.id,
            fid: divisions.fid,
            name: divisions.name,
            abbr: divisions.abbr,
            coverage: divisions.coverage,
            shape: divisions.shape,
            label: divisions.label,
            weight: sql<number | null>`MAX(${visual_to_division.weight})`,
            labelAsSelector: sql<boolean>`MAX(${visual_to_division.labelAsSelector}::int)`,
            tickets: sql<Record<string, {
                votes: number,
                source: string | null,
                isTotal: boolean
            }>>`
            jsonb_object_agg(
                tickets.id::text,
                jsonb_build_object(
                'id', tickets.id,
                'votes', results.votes,
                'source', results.source,
                'isTotal', tickets.is_total
                )
            )
            `,
        })
        .from(tickets)
        .rightJoin(races, eq(tickets.race, races.username))
        .rightJoin(results, eq(results.ticket, tickets.id))
        .leftJoin(divisions, eq(divisions.id, results.division))
        .leftJoin(visual_to_division, eq(visual_to_division.division, divisions.id))
        .where(
            and(
                eq(races.year, Number(year)),
                eq(races.title, 'U.S. President'),
                eq(races.type, 'general'),
                eq(visual_to_division.visual, 'electoral_college_2022')
            )
        )
        .orderBy(sql`MAX(visual_to_division.label_as_selector::int) ASC`)
        .groupBy(divisions.id);


    console.log("get states 2")
    const states = states_raw.map(x => {
        let total = null;
        let victor: any | null = null;
        const theTickets: any = {};

        for (const [key, value] of Object.entries(x.tickets)) {
            if (value.isTotal) {
                total = value.votes;
                continue;
            }
            else if (!victor || victor.votes < value.votes) {
                victor = value;
            }
            theTickets[key] = value;
        }

        return {
            ...x,
            tickets: theTickets,
            victor: victor?.id ?? null,
            total: total,
            weight: x.coverage === 'us_cd' ? 1 : x.weight
        }
    })

    console.log("get counties")
    const counties_raw = await drizzle.db.select({
        id: divisions.id,
        name: divisions.name,
        abbr: divisions.abbr,
        coverage: divisions.coverage,
        shape: divisions.shape,
        label: divisions.label,
        tickets: sql<Record<string, {
            votes: number,
            source: string | null,
            isTotal: boolean
        }>>`
            jsonb_object_agg(
                tickets.id::text,
                jsonb_build_object(
                'id', tickets.id,
                'votes', results.votes,
                'source', results.source,
                'isTotal', tickets.is_total
                )
            )
            `,
    })
        .from(tickets)
        .rightJoin(races, eq(tickets.race, races.username))
        .rightJoin(results, eq(results.ticket, tickets.id))
        .leftJoin(divisions, eq(divisions.id, results.division))
        .where(
            and(
                eq(races.year, Number(year)),
                eq(races.title, 'U.S. President'),
                eq(races.type, 'general'),
                eq(divisions.coverage, 'us_county_equivalent')
            )
        )
        .groupBy(divisions.id);

    console.log("get counties 2")
    const counties = counties_raw.map(x => {
        let total = null;
        let victor: any | null = null;
        const theTickets: any = {};

        for (const [key, value] of Object.entries(x.tickets)) {
            if (value.isTotal) {
                total = value.votes;
                continue;
            }
            else if (!victor || victor.votes < value.votes) {
                victor = value;
            }
            theTickets[key] = value;
        }

        return {
            ...x,
            tickets: theTickets,
            victor: victor?.id ?? null,
            total: total
        }
    })

    const theParams = new URLSearchParams({
        year
    });

    const runningMate = alias(people, 'running_mate');

    console.log("get candidates")
    const candidates = await drizzle.db.select({
        ...getTableColumns(tickets),
        person: getTableColumns(people),
        runningMate: getTableColumns(runningMate)
    })
        .from(tickets)
        .leftJoin(races, eq(races.username, tickets.race))
        .leftJoin(people, eq(people.username, tickets.person))
        .leftJoin(runningMate, eq(runningMate.username, tickets.running_mate))
        .where(
            eq(races.username, `${year}_gen_us.president`),
        )

    const used_colors = new Set();

    console.log("get race")
    const [race] = await drizzle.db.select()
        .from(races)
        .where(and(
            eq(races.year, Number(year)),
            eq(races.title, 'U.S. President'),
            eq(races.type, 'general')
        ))

    return {
        states,
        candidates,
        year,
        race,
        counties
    };
}