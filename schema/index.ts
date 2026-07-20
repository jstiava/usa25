import { sql } from "drizzle-orm";
import { pgTable, decimal, varchar, integer, boolean, text, serial, unique, timestamp } from "drizzle-orm/pg-core";


/**
 * username: james_r_thompson,
 * name: James R. Thompson,
 * lastname: Thompson
 */
export const people = pgTable('people', {
    username: varchar().primaryKey(),
    name: varchar().notNull(),
    lastname: varchar().notNull(),
    portrait: varchar(),
    birthplace: varchar(),
    bio: text(),
    born: integer(),
    died: integer()
});


/**
 * fid: 17,
 * name: Illinois,
 * abbr: IL,
 * shape: <path></path>
 * label: null,
 * isLabelWithinShape: TRUE,
 * coverage: 'us_state',
 * established: 2011,
 * retired: 2021
 */
export const divisions = pgTable('divisions', {
    id: serial().primaryKey(),
    fid: varchar('fid'),
    name: varchar('name').notNull(),
    abbr: varchar('abbr'),
    shape: text('shape'),
    label: text('label'),
    isLabelWithinShape: boolean('is_label_within_shape').default(true),
    coverage: varchar('coverage'),
    established: integer(),
    retired: integer()
});


/**
 * id: 1,
 * prefix: 17001 - Cook County,
 * predicates 'is_within': 
 * suffix: 17 - illinois,
 * prefixOverlappingSuffix: 1,
 * suffixOverlappingPrefix: 0.01
 */
export const spatial_relationships = pgTable('spatial_relationships', {
    id: serial().primaryKey(),
    prefix: integer().references(() => divisions.id),
    predicate: varchar(),
    suffix: integer().references(() => divisions.id),
    prefixOverlappingSuffix: decimal(),
    suffixOverlappingPrefix: decimal(),
});



/**
 * username: 'democratic',
 * name: "Democratic Party"
 */
export const parties = pgTable('parties', {
    username: varchar().primaryKey(),
    name: varchar(),
})


/**
 * username: '2026_IL_USSENIII_GEN",
 * year: 2026,
 * type: 'primary',
 * primaryParty: 'democratic',
 * servingScale: 'federal',
 * division: 17,
 * title: "U.S. Senator",
 * class: 'III',
 * isLastStage: false,
 * notes: "Info subject to change."
 * 
 */
export const races = pgTable('races', {
    username: varchar().primaryKey(),
    year: integer().notNull(),
    type: varchar().default('general').notNull(),
    primaryParty: varchar('primary_party').references(() => parties.username),
    servingScale: varchar('serving_scale').default('federal'),
    division: integer().references(() => divisions.id),
    title: varchar().notNull(),
    class: varchar(),
    isLastStage: boolean('isLastStage').default(false).notNull(),
    notes: text()
})


/**
 * id: 1,
 * race: "2026_IL_GOV_DEM_PRIMARY",
 * person: 'jb_pritzker',
 * running_mate: 'christian_mitchell',
 * party: 'democratic',
 * isWinner: null,
 * notes: 'Has not happened yet'
 */
export const tickets = pgTable('tickets', {
    id: serial().primaryKey(),
    race: varchar().references(() => races.username),
    person: varchar().references(() => people.username),
    running_mate: varchar().references(() => people.username),
    party: varchar().references(() => parties.username),
    isWinner: boolean('is_winner').default(false).notNull(),
    notes: text(),
    isTotal: boolean('is_total').notNull().default(false),
    color: varchar()
}, (t) => [
    sql`CONSTRAINT one_totals_ticket_per_race UNIQUE (race) WHERE is_total IS TRUE`
]);



/**
 * id: 1,
 * ticket: 1,
 * division: 17,
 * votes: 1432523,
 * source: Illinois Blue Book, 1976
 */
export const results = pgTable('results', {
    id: serial().primaryKey(),
    ticket: integer().references(() => tickets.id),
    division: integer().references(() => divisions.id),
    votes: integer().default(0).notNull(),
    source: text()
}, (t) => [
    unique('one_result_per_ticket_per_division').on(t.division, t.ticket),
])



/**
 * username: 'states',
 * name: "50 States"
 */
export const visualizations = pgTable('visualizations', {
    username: varchar().primaryKey(),
    name: varchar(),
})

/**
 * id: 0,
 * visual: 'states',
 * division: 17
 */
export const visual_to_division = pgTable('visual_to_division', {
    id: serial().primaryKey(),
    visual: varchar().references(() => visualizations.username),
    division: integer().references(() => divisions.id),
    weight: integer(),
    labelAsSelector: boolean('label_as_selector').default(false).notNull()
})


export const Users = pgTable("users", {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar(),
    username: varchar().notNull(),
    abbr: varchar({ length: 16 }),
    email: varchar(),
    description: varchar(),
    is_admin: boolean().default(false).notNull(),
    birthday: timestamp({ withTimezone: true }),
    home_timezone: varchar(),
    passkey: varchar().notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    status: varchar().default('created_not_activated')

})

export const Sessions = pgTable("session", {
    id: varchar({ length: 255 }).primaryKey(),
    user_id: varchar({ length: 255 }).notNull(),
    status: varchar().default("active"),
    created_at: timestamp({ withTimezone: true }).defaultNow(),
    last_accessed_at: timestamp({ withTimezone: true }).defaultNow(),
    expires_at: timestamp({ withTimezone: true }).defaultNow(),
    revoked_at: timestamp({ withTimezone: true }),
    ipAddress: varchar(),
    product_version: varchar(),
    notes: varchar()
})


export type AppUserType = typeof Users.$inferInsert;
export type AppUserViewType = typeof Users.$inferSelect;
export type AppUserPublicType = Omit<AppUserViewType, "passkey">;


export type DivisionProps = typeof divisions.$inferSelect 

