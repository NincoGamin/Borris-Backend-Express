const { getBotGuilds } = require('../utils/api')
const User = require('../database/schemas/User')
const { getMutualGuilds } = require('../utils/utils')
const router = require('express').Router()
const GuildConfig = require('../database/schemas/GuildConfig')

router.get('/guilds', async (req, res) => {
    const guilds = await getBotGuilds()
    const user = await User.findOne({ discordId: req.user.discordId })
    if(user){
        const userGuilds = user.get('guilds')
        const mutualGuilds = getMutualGuilds(userGuilds, guilds)
        res.send(mutualGuilds)
    }else {
        return res.status(401).send({meg: 'Unauthorized'})
    }
})

router.put('/guild/:guildId/prefix', async (req, res) => {
    const { prefix } = req.body
    const { guildId } = req.params

    if(!prefix) return res.status(400).send('Prefix Required')

    const update = await GuildConfig.findOneAndUpdate({ guildId }, { prefix }, {new: true})
    return update ? res.send(update) : res.status(400).send({ msg: "Could not find the document" })
})

router.get('/guilds/:guildId/config', async (req, res) => {
    const { guildId } = req.params
    const config = await GuildConfig.findOne({ guildId })
    return config ? res.send(config) : res.status(404).send({ mes: "Not Found" })
})

module.exports = router