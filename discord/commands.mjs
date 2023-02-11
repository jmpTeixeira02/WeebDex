import { SlashCommandBuilder } from 'discord.js';




export default function(db) {

    const ping = {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!'),
        async execute(interaction) {
            await interaction.reply('Pong!');
        },
    }
    
    const set_channel = {
        data: new SlashCommandBuilder()
            .setName('set_channel')
            .setDescription('Set the current channel to be where all the new chapter updates get announced!'),
        async execute(interaction, dataOptions){
            const table = dataOptions.table.name
            const data = dataOptions.entry_options(interaction)

            const [res, error] = await db.select(table, data.select.condition)
            if (res.rows.length == 0){
                await db.insert(table, data.insert.values)
            }else{
                await db.update(table, data.update.values, data.update.condition)
            }

            await interaction.reply('This channel was set as the announcement channel!')
        }
    }

    const current_channel = {
        data: new SlashCommandBuilder()
            .setName('current_channel')
            .setDescription('Display the current announcement channel!'),
        async execute(interaction, dataOptions){
            const table = dataOptions.table.name
            const data = dataOptions.entry_options(interaction)

            const [res, error] = await db.select(table, data.select.condition)
            if (res.rows.length == 0){
                await interaction.reply('Currently there is no announcement channel! Use the command \'set_channel\' to set one!')
            }
            else{
                await interaction.reply(`Current announcement channel: ${res.rows[0].channel_name}`)
            }
        }
    }

    return {ping: ping, set_channel: set_channel, current_channel: current_channel}
} 
