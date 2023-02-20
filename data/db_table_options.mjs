export default {
    discord:{
        table: {
            name: "discord_servers",
            columns: `
                id VARCHAR(64) PRIMARY KEY,
                channel_id VARCHAR(64),
                channel_name VARCHAR(1024)
            `
        },
        entry_options: (entry) => {
            return {
                select: {
                    condition: {id: entry.guildId}
                },
                insert: {
                    values: {channel_id: entry.channelId, id: entry.guildId, channel_name: entry.channel.name}
                },
                update: {
                    values: {channel_id: entry.channelId},
                    condition: {id: entry.guildId}
                }
            }
        }
    },
    manwha:{
        table: {
            name: "manwha",
            columns: `
                id SERIAL PRIMARY KEY,
                name VARCHAR (1024) NOT NULL,
                chapter decimal,
                publish boolean NOT NULL
            `
        },
        entry_options: (entry) => {
            // In postgres to use a ' character it needs to be doubled up
            const idx = entry.title.indexOf("'")
            const title = idx == -1 ? entry.title : entry.title.slice(0, idx) + "'" + entry.title.slice(idx)	
            return {
                select: {
                    condition: {name: title}
                },
                insert: {
                    values: {name: title, chapter: entry.chapter, publish: false}
                },
                update: {
                    values: {chapter: entry.chapter},
                    condition: {name: title}
                }
            }
        }
    }
}