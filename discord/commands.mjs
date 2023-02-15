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
            const table = dataOptions.discord.table.name
            const data = dataOptions.discord.entry_options(interaction)

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
            const table = dataOptions.discord.table.name
            const data = dataOptions.discord.entry_options(interaction)

            const [res, error] = await db.select(table, data.select.condition)
            if (res.rows.length == 0){
                await interaction.reply('Currently there is no announcement channel! Use the command \'set_channel\' to set one!')
            }
            else{
                await interaction.reply(`Current announcement channel: ${res.rows[0].channel_name}`)
            }
        }
    }

    const update_publishing = {
        data: new SlashCommandBuilder()
            .setName('update_publishing')
            .setDescription('Enable/Disable the publish of a given title')
            .addStringOption(option =>
                option.setName('title')
                    .setDescription("The title desired to be updated")
                    .setRequired(true)),
        async execute(interaction, dataOptions){
            const table = dataOptions.manwha.table.name
            const input = interaction.options.getString('title')

            const [resSelect, errorSelect] = await db.select(table, {name: input})
            if (resSelect.rows.length == 0 || errorSelect){
                await interaction.reply('This title is not being monitored. Please ensure the name is correct!')
            }else{
                const title = resSelect.rows[0]
                const [res, error] = await db.update(table, {publish: !title.publish}, {name: title.name})
                const current_publish = !title.publish == true ? "being published" : "not being published"
                await interaction.reply(`This title is now ${current_publish}`)
            }
        }
    }

    const add_title = {
        data: new SlashCommandBuilder()
            .setName('add_title')
            .setDescription('Adds a title to the database and enables publishing')
            .addStringOption(option =>
                option.setName('title')
                    .setDescription("The title desired to be added")
                    .setRequired(true)),
        async execute(interaction, dataOptions){
            const table = dataOptions.manwha.table.name
            const input = interaction.options.getString('title')

            const [resSelect, errorSelect] = await db.select(table, {name: input})
            if (resSelect.rows.length != 0 || errorSelect){
                await interaction.reply('This title has already been added!')
            }else{
                const title = resSelect.rows[0]
                const [res, error] = await db.insert(table, {publish: true, name:input, chapter:-1})
                if (res)
                    await interaction.reply(`This title has been added and is gonna be published!`)
                else
                await interaction.reply(`An error has ocurred!`)

            }
        }
    }

    // const show_titles = {
    //     data: new SlashCommandBuilder()
    //         .setName('show_titles')
    //         .setDescription('Show the titles that are currently being monitored')
    //         .addBooleanOption(option =>
    //             option.setName('publish')
    //                 .setDescription("Show titles that are being published or not")
    //                 .setRequired(true)),
    //     async execute(interaction, dataOptions){
    //         const table = dataOptions.manwha.table.name
    //         const input = interaction.options.getString('publish')

    //         const [resSelect, errorSelect] = await db.select(table, {name: input})
    //     }
    // }

    return {
        ping: ping, 
        set_channel: set_channel, 
        current_channel: current_channel, 
        update_publishing: update_publishing,
        add_title: add_title
    }
} 
