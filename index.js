const Discord = require("discord.js"),
    client = new Discord.Client(),
    config = require("./config.json"),
    webhookURLExploded = config.tracker_hook.split("/"),
    tracker = {
        id: "",
        webhook_config: {
            token: webhookURLExploded.pop(),
            id: webhookURLExploded.pop(),
        },
    }

client.once("ready", async () => {
    console.log("The DISCORD tracking can start !")
})

client.on("messageReactionAdd", async (messageReaction, user) => {
    if (user.id === tracker.id) {
        try {
            ;(
                await client.fetchWebhook(
                    tracker.webhook_config.id,
                    tracker.webhook_config.token
                )
            ).send(
                new Discord.RichEmbed()
                    .setTitle("REACTION ADDED TRACKER :")
                    .setDescription(
                        messageReaction.message.content
                            ? messageReaction.message.content
                            : messageReaction.message.embeds.length > 0
                            ? messageReaction.message.embeds.pop().description
                            : "No content avaible."
                    )
                    .setFooter(`Reaction : ${messageReaction.emoji}`)
                    .setAuthor(
                        user.tag,
                        user.avatarURL || user.defaultAvatarURL,
                        messageReaction.message.url
                    )
                    .setTimestamp()
                    .setColor(0x2f3136)
            )
        } catch (_) {
            0
        }
    }
})

client.on("messageReactionRemove", async (messageReaction, user) => {
    if (user.id === tracker.id) {
        try {
            ;(
                await client.fetchWebhook(
                    tracker.webhook_config.id,
                    tracker.webhook_config.token
                )
            ).send(
                new Discord.RichEmbed()
                    .setTitle("REACTION REMOVED TRACKER :")
                    .setDescription(
                        messageReaction.message.content
                            ? messageReaction.message.content
                            : messageReaction.message.embeds.length > 0
                            ? messageReaction.message.embeds.pop().description
                            : "No content avaible."
                    )
                    .setFooter(`Reaction : ${messageReaction.emoji}`)
                    .setAuthor(
                        user.tag,
                        user.avatarURL || user.defaultAvatarURL,
                        messageReaction.message.url
                    )
                    .setTimestamp()
                    .setColor(0x2f3136)
            )
        } catch (_) {
            0
        }
    }
})

// Ne fonctionne que dans les guilds...
client.on("voiceStateUpdate", async (oldMember, newMember) => {
    if (newMember.user.id === tracker.id) {
        const newState = newMember.voiceChannel,
            oldState = oldMember.voiceChannel
        try {
            ;(
                await client.fetchWebhook(
                    tracker.webhook_config.id,
                    tracker.webhook_config.token
                )
            ).send(
                new Discord.RichEmbed()
                    .setTitle(
                        `VOICE CHANNEL ${
                            newState
                                ? "JOINED"
                                : "LEFT"
                        } TRACKER :`
                    )
                    .setDescription(
                        `${newMember.user} ${
                            newState ? "joined" : "left"
                        } a voice channel.`
                    )
                    .setFooter(
                        `Voice channel name : ${
                            newState
                                ? newState.name
                                    ? newState.name
                                    : "can't resolve the name"
                                : oldState
                                ? oldState.name
                                    ? oldState.name
                                    : "can't resolve the name"
                                : "can't resolve the name"
                        } (guild : ${newMember.guild.name})`
                    )
                    .setAuthor(
                        newMember.user.tag,
                        newMember.user.avatarURL ||
                            newMember.user.defaultAvatarURL
                    )
                    .setTimestamp()
                    .setColor(0x2f3136)
            )
        } catch (_) {
            0
        }
    }
})

client.on("message", async (message) => {
    const args = message.content.split(/ +/g),
        cmd = args.shift().toLowerCase()

    if (cmd.startsWith(config.prefix) && message.author.id === client.user.id) {
        if (cmd === `${config.prefix}track`) {
            const id = args.shift()
            if (id) {
                const user = client.users.get(id)
                if (user) {
                    tracker.id = id
                    try {
                        ;(
                            await client.fetchWebhook(
                                tracker.webhook_config.id,
                                tracker.webhook_config.token
                            )
                        ).send(
                            new Discord.RichEmbed()
                                .setTitle("TRACKING STARTED :")
                                .setDescription(`${user} is now focused.`)
                                .setAuthor(
                                    user.tag,
                                    user.avatarURL || user.defaultAvatarURL
                                )
                                .setTimestamp()
                                .setColor(0x2f3136)
                        )
                    } catch (_) {
                        0
                    }
                } else {
                    try {
                        await message.reply("The user wasn't found.")
                    } catch (_) {
                        0
                    }
                }
            } else {
                try {
                    await message.reply("You must specify the user ID.")
                } catch (_) {
                    0
                }
            }
        }
    }

    if (message.author.id === tracker.id) {
        try {
            ;(
                await client.fetchWebhook(
                    tracker.webhook_config.id,
                    tracker.webhook_config.token
                )
            ).send(
                new Discord.RichEmbed()
                    .setTitle("MESSAGE TRACKER :")
                    .setDescription(message.content)
                    .setAuthor(
                        message.author.tag,
                        message.author.avatarURL ||
                            message.author.defaultAvatarURL,
                        message.url
                    )
                    .setTimestamp()
                    .setColor(0x2f3136)
            )
        } catch (_) {
            0
        }
    }
})

client.login(config.token)
