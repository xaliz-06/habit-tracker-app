import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, primaryKey, unique,  } from "drizzle-orm/sqlite-core";
			
export const user = sqliteTable("user", 
    {
        id: text("id").primaryKey(),
        name: text('name').notNull(),
        email: text('email').notNull().unique(),
        emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
        image: text('image'),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable("session", 
    {
        id: text("id").primaryKey(),
        expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
        token: text('token').notNull().unique(),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
	}
);

export const account = sqliteTable("account", 
    {
        id: text("id").primaryKey(),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        idToken: text('id_token'),
        accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
        refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
        scope: text('scope'),
        password: text('password'),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	}
);

export const verification = sqliteTable("verification", 
    {
        id: text("id").primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' }),
        updatedAt: integer('updated_at', { mode: 'timestamp' })
    }
);

export const habit = sqliteTable("habit",
    {
        id: text("id").primaryKey(),
        name: text('name').notNull(),
        description: text('description'),
        userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
        color: text('color').notNull(),
        streak: integer('streak').notNull().default(0),
        lastCompleted: integer('last_completed', { mode: 'timestamp' }),
        isRepeatable: integer('is_repeatable', { mode: 'boolean' }).notNull().default(false),
        createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`)
    }
)

export const habitCompletion = sqliteTable("habit_completion",
    {
        completionId: text("completion_id").primaryKey(),
        habitId: text('habit_id').notNull().references(()=> habit.id, { onDelete: 'cascade' }),
        completionDate: integer('completion_date', { mode: 'timestamp' }).notNull(),
        completionCount: integer('completion_count').default(0),
    },
    (table) => [
        unique('unique_completion').on(table.completionDate, table.habitId)
    ]
)

export const habitRelations = relations(habit, ({many}) => ({
    completions: many(habitCompletion)
}))

export const completionRelations = relations(habitCompletion, ({ one }) => ({
    user: one(habit, {
        fields: [habitCompletion.habitId],
        references: [habit.id]
    })
}))

// TODO: Add Indexing