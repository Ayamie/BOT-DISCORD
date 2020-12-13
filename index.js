const Discord = require ("discord.js");
const bdd = require ("./bdd.json");
const pagination = require('discord.js-pagination');
const fs = require ("fs");
const prefix = bdd.prefix;
const ms = require ("ms");
const path = require ("path");
const userdCommandRecently = new Set();
const arraySort = require("array-sort");
const parseDuration = require('parse-duration');
const table = require("table");
const fetch = require('node-fetch');
const figlet = require('figlet');
const search = require('youtube-search');
const guildInvites = new Map();
const token = require ("./token.json");
const humanizeDuration = require("humanize-duration");
const cooldown = new Set();
const moment = require ("moment");
const api = require("imageapi.js");
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

bot.on("ready", async () => {
    console.log('salut je suis prêt')
    bot.user.setStatus("idle");
    
    let statuts = bdd.stats
    setInterval(function() {       
        let stats = statuts[Math.floor(Math.random()*statuts.length)];
        bot.user.setActivity(stats, {type: "STREAMING"})
    }, 20000)
       
})

const { GiveawaysManager } = require("discord-giveaways");

// Starts updating currents giveaways

const manager = new GiveawaysManager(bot, {

    storage: "./giveaways.json",

    updateCountdownEvery: 10000,

    default: {

        botsCanWin: false,

        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],

        embedColor: "#2F3136",

        reaction: "765337422279475260"

    }

});
  
bot.on("message", async message => {

    let commande = message.content.trim().split(" ")[0].slice(bdd[message.guild.id].prefix.length);
    let args = message.content.trim().split(" ").slice(bdd[message.guild.id].prefix.length);

let prefix = bdd[message.guild.id]["prefix"] || "!"

bot.giveawaysManager = manager;
 
    if (message.content === "<@764625811494928425>") {
    message.channel.send(`mon prefix est: ${prefix}`)
   
     }
     
if (commande === "bump") {
 if (userdCommandRecently.has(message.author.id)) {
 let embed = new Discord.MessageEmbed()     
.setAuthor(`${message.author.username}`, message.author.avatarURL())
.setDescription("<@" + message.author.id + ">, attendez encore 30 minutes avant que le serveur puisse être bumpé !")
.setColor("#2f3136") 
.setThumbnail("https://cdn.discordapp.com/attachments/728139160648679519/787165970191089674/5530_koyabotOk.png")
   message.channel.send(embed)
 } else {
let embed = new Discord.MessageEmbed() 
.setAuthor(`${message.author.username}`, message.author.avatarURL())
.setDescription("bump effectué 👍\nVotre serveur a été bump avec succès !\nAllez vérifier ça sur DASHBOARD : [Click here](https://bit.ly/3nenJMb )")
.setColor("#2f3136")
.setImage("https://cdn.discordapp.com/attachments/728139160648679519/787166610409783296/20201211_235850.png")
     message.channel.send(embed)
     userdCommandRecently.add(message.author.id)
 }
 setTimeout(() => {
  userdCommandRecently.delete(message.author.id)   
 }, 30000);
}
if (message.content.startsWith(prefix + "wanted")) {
const attachment = new Discord.MessageAttachment(
"https://cdn.discordapp.com/attachments/767092178911625237/787334073378275360/file.jpg"
)    
message.channel.send(`${message.author} tu es recherché !`, attachment)
}

   
if (commande === "anti-link") {
if (bdd[message.guild.id]["anti-link"] == true) {
        bdd[message.guild.id]["anti-link"] = false
        Savebdd();
        return message.channel.send('Vous venez d\'arreter le système anti lien !');
    } else {
        bdd[message.guild.id]["anti-link"] = true;
        Savebdd();
        return message.channel.send('Vous venez d\'alumer le système anti lien !');
    }
}
if (bdd[message.guild.id]["anti-link"] == true) {
if (message.content.startsWith("https://discord.gg/")) {  
message.delete();
let embed = new Discord.MessageEmbed() 
.setAuthor(`${message.author.username} Warned`, message.author.avatarURL())
.setDescription("rainson: Pub")
.setColor("#2f3136")
message.channel.send(embed)    
Savebdd()
    }   
 }
 
if (commande === "rapport") {  
message.delete();
let channel = bot.channels.cache.find(channel => channel.id === "785814055607992350")    
if (!channel) return;    
channel.send(`${args.join(" ")}`)    
}   
         
if (message.content == prefix + "setjoin") {
const moderation = new Discord.MessageEmbed()
      .setTitle("🪛 **ACTION NON EFFECTUÉE**")
        .setDescription('<:emoji_55:774625728343703594> | Désolé, Je ne possède pas cette commande.')              
        .setColor("#2f3136")  
        .setTimestamp()
        .setFooter("Slywinter", "https://cdn.discordapp.com/avatars/764625811494928425/26650d3a7d1959ff9e7bbad408528407.png")
        message.channel.send(moderation)           
}
     
if (message.content == prefix + "setleave") {
const moderation = new Discord.MessageEmbed()
      .setTitle("🪛 **ACTION NON EFFECTUÉE**")
        .setDescription('<:emoji_55:774625728343703594> | Désolé, Je ne possède pas cette commande.')              
        .setColor("#2f3136")  
        .setTimestamp()
        .setFooter("Slywinter", "https://cdn.discordapp.com/avatars/764625811494928425/26650d3a7d1959ff9e7bbad408528407.png")
        message.channel.send(moderation)           
}
     
     
    
     
if (commande === "dm") {
   
 if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.channel.send("vous avez pas la permissions d'utiliser cette commande !");
    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!user)
      return message.channel.send(
        `You did not mention a user, or you gave an invalid id`
      );
    if (!args.slice(1).join(" "))
      return message.channel.send("veuillez inscrire un message");
    user.user
      .send(args.slice(1).join(" "))
      .catch(() => message.channel.send("veuillez mentionné un membre ou mettre son id !"))
      .then(() => message.channel.send(`Sent a message to ${user.user.tag}`));
  }   
       
if (commande === "tempmute") {
if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à mute.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez mute le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas mute ce membre.')
        if (!member.manageable) return message.channel.send('Le bot ne peut pas mute ce membre.')
        const duration = parseDuration(args[1])
        if (!duration) return message.channel.send('Veuillez indiquer une durée valide.')
        const reason = args.slice(2).join(' ') || 'Aucune raison fournie.'
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) {
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'Muted',
                    permissions: 0
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }))
        }
        await member.roles.add(muteRole)
        message.channel.send(`${member} a été mute pendant ${humanizeDuration(duration, {language: 'fr'})} !`)
        setTimeout(() => {
            if (member.deleted || !member.manageable) return
            member.roles.remove(muteRole)
            message.channel.send(`${member} a été unmute.`)
        }, duration)
    }
    
if(message.content === prefix + "botinfo"){
 let embed = new Discord.MessageEmbed()
 .setTitle('')
 .setDescription("📍╿information")
 .addFields(
     { name: '<:emoji_10:785374295273897995>╿Développer', value: '`Jordan_offshl`', inline: true },    
     { name: '<:emoji_10:785374295273897995>╿Statistique', value: '`76` serveur\n`476` membre\n`3007`channel', inline: true }, 
     { name: '<:emoji_10:785374295273897995>╿Prefix', value: '`!`', inline: true }, 
     { name: '<:emoji_10:785374295273897995>╿Hebergeur', value: '`VSC`', inline: true }, 
     { name: '<:emoji_10:785374295273897995>╿Date de création ', value: '`le 10 octobre 2020`', inline: true },     
     { name: '<:emoji_10:785374295273897995>╿Version slywinter ', value: '`3.0.9`', inline: true },     
     { name: '<:emoji_10:785374295273897995>╿Librairy', value: '`Discord.js`', inline: true },     
     { name: '<:emoji_10:785374295273897995>╿Soon...', value: '`Soon..`', inline: true },     
 )
.setThumbnail("https://cdn.discordapp.com/avatars/764625811494928425/26650d3a7d1959ff9e7bbad408528407.png")
.setImage("https://cdn.discordapp.com/attachments/728139160648679515/784591035694448670/standard_12.gif")
.setColor("#2f3136")   
.setFooter(''); 
 message.channel.send(embed)
 message.delete();
 }
        
if (commande === "ascii") {
if(!args[0]) return message.channel.send('Please provide some text');

        msg = args.join(" ");

        figlet.text(msg, function (err, data){
            if(err){
                console.log('Something went wrong');
                console.dir(err);
            }
            if(data.length > 2000) return message.channel.send('Please provide text shorter than 2000 characters')
            message.channel.send('```' + data + '```')
        })
    }
         
if (commande === "tempban") {
if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à bannir.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez pas bannir le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas Bannir ce membre.')
        if (!member.bannable) return message.channel.send('Le bot ne peut pas bannir ce membre.')
        const duration = parseDuration(args[1])
        if (!duration) return message.channel.send('Veuillez indiquer une durée valide.')
        const reason = args.slice(2).join(' ') || 'Aucune raison fournie'
        await member.ban({reason})
        message.channel.send(`${member.user.tag} a été banni pendant ${humanizeDuration(duration, {language: 'fr'})} !`)
        setTimeout(() => {
            message.guild.members.unban(member)
            message.channel.send(`${member.user.tag} a été débanni.`)
        }, duration)
    }

 if (message.content.startsWith(prefix + "help")) {
    let TicketEmbed = new Discord.MessageEmbed()
    .setDescription(`<:badge:784623196003237898> Le préfix du bot dans **${message.guild.name}** est **${prefix}**\nLe bot contient actuellement 91 commandes\nSi vous souhaitez obtenir de l'aide à propos d'une commande écrivez : !<commande>`)
.setThumbnail("https://cdn.discordapp.com/avatars/764625811494928425/26650d3a7d1959ff9e7bbad408528407.png")
.addField("<a:arrow:781616679578894367> 🔒 administration(9)", "`giverole,removerole, annonce, config, delrole, slowmode, sondage, setbot, anti-link, ban, unban, mute, unmute, tempmute, warn, rapport`")
.addField("<a:arrow:781616679578894367> 🌟 configuration(4)", "`setjoin, setleave, setprefix,setlogs`")
.addField("<a:arrow:781616679578894367> 🛢 Fun(8)", "`8ball, ascii, dog,lien, avatar, say, meme, reddit`")
.addField("<a:arrow:781616679578894367> ⛏ Modération(6)", "`ban, unban, clear, kick, mute, unmute`")
.addField("<a:arrow:781616679578894367> 🔞 Nsfw(3)", "`fuck, pussy, dog`")
.addField("<a:arrow:781616679578894367> 🎏 Utilitaire(10)", "`avatar, gstart, groll, ping, invite, seveur_info, user_info, botinfo, say, text, bump`")
.addField("<a:arrow:781616679578894367> 👑 Owner(4)", "`reboot, botoff, serveur list, blacklist`")
.addField("Liens utiles", "([support](https://discord.gg/ea6PzfwNh4) | [Invitation](https://discord.com/oauth2/authorize?client_id=764625811494928425&scope=bot&permissions=8) | [Site web](https://bit.ly/2IWe2D9))")
.setImage("https://cdn.discordapp.com/attachments/728139160648679515/784591035694448670/standard_12.gif")
.setColor("#2f3136")   
.setFooter("Support du serveur")
 message.channel.send(TicketEmbed)
 }
         
     if (message.content.startsWith(prefix + "ticket")) {
   message.delete()

    let TicketEmbed = new Discord.MessageEmbed()
    .setColor("#cd3")
    .setAuthor("Support du serveur")
    .setDescription("Pour créer un ticket, appuyez sur la réaction")
    .setFooter("Support du serveur")

    message.channel.send(TicketEmbed).then(async msg => {
        msg.react("🎟️")
    })
}


    
  if (message.content.startsWith(prefix + "InviteCounter")) {
    message.delete();

        let invites = await message.guild.fetchInvites().catch(error => {
            return message.channel.send("Désoler, je n'ai pas la permission de voir les invitations")
        })

        invites = invites.array();


        arraySort(invites, 'uses', { reverse: true})

        let possibleInvites = [['Utilisateur', 'Utilisé']]
        invites.forEach(function(invite) {
            possibleInvites.push([invite.inviter.username, invite.uses])
        })

        let LeaderEmbed = new Discord.MessageEmbed()
        .setColor("#2F3136")
        .addField("LeaderBoard des invitations", `\`\`\`${table.table(possibleInvites)}\`\`\``)

        message.channel.send(LeaderEmbed)
}  
     
     if (message.content.startsWith(prefix + "emojis")) {
       let arg = message.content.trim().split(/ +/g);
       const ms = (arg.splice(1).join(' '));
       let embed = new Discord.MessageEmbed() 
       .setTitle("emoji name : "+ ms) 
       .setDescription("🆔️ : `" + ms + "`") 
       .setColor("#2F3136")
       message.channel.send(embed)
     }
     
     
if (message.content.startsWith(prefix + "gstart")) {
 if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("tu n'a pas la permissions de lancé des giveaways");

        let channel = message.mentions.channels.first();

        if (!channel) return message.channel.send('veuillez mentionné un salon');

        let giveawayDuration = args[1];

        if (!giveawayDuration || isNaN(ms(giveawayDuration))) return message.channel.send('mettre un temps valid duration');

        let giveawayWinners = args[2];

        if (isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) return message.channel.send('inscrire le nombre de gagnant');

        let giveawayPrize = args.slice(3).join(" ");

        if (!giveawayPrize) return message.channel.send('veulliez inséré un cadeaux');

        bot.giveawaysManager.start(channel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayWinners,
            hostedBy: message.author,

            messages: {
                giveaway: "🎉 **GIVEAWAY** 🎉",
                giveawayEnded: "🎉 **GIVEAWAY TERMINÉE** 🎉",
                timeRemaining: "⏲・Temps restant: **{duration}**",
                inviteToParticipate: "React with 🎉 to enter\n\r",
                winMessage: "`🎉`・Bien joué, {winners}! Vous gagnez **{prize}**",
                embedFooter: "Giveaway time!",
                noWinner: "🎉・pas de gagnant ",
                hostedBy: "👑・Host par {user}",
                winners: "🏆・gagnant(s)",
                endedAt: "Ends at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false
                }
            }
        })

        message.channel.send(`Giveaway starting in ${channel}`);
    } 
    
    
    
    
if (commande === "pussy") {
const answers = [
"https://cdn.boob.bot/Gifs/18F7.gif",
"https://78.media.tumblr.com/b21081509e3da65ba9c875bc35844347/tumblr_oxcmcyyJSv1wbipw8o1_1280.jpg",
"https://78.media.tumblr.com/40d2fac806e64c6163fffe3396d398e3/tumblr_p24x2xJXgR1vhreo5o1_1280.jpg",
"https://i.redd.it/qqsajfhft9141.jpg",
"http://imgur.com/oLRqP7V.jpg",
"<:crono:759946432147881994> veuillez patienter 10s avant de réutiliser la commande !",
"https://cdn.discordapp.com/attachments/668981160206139424/668995194464501770/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668995359707627520/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668995810566078464/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996065256538122/images_4.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996065701265428/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996322355052590/images_4.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996322355052590/images_4.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996322640134154/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996643252863006/images_4.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996643424698368/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668996922698235904/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668997217293697044/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668997569619165204/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668997959870054400/images_4.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668997960058535956/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668998267287109642/images_5.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668998267471790081/images_4.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668998267815591936/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/668998481662312488/images_3.jpeg",
"https://cdn.discordapp.com/attachments/668981160206139424/670439551768199223/images_3.jpeg"

]

    if (message.channel.nsfw === true) {

    const answer = answers[Math.floor(Math.random() * answers.length)];

    let embeddog = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle("🔞 PUSSY 🔞")
    .setImage(answer)
    .setFooter("Images Fournies par https://giphy.com/gifs");

    message.channel.send(embeddog);

    message.delete();
}else {
    message.channel.send("Ce n'est pas un salon NSFW") 
}
}

if (commande === "triggered") {
let avatar = message.author.displayAvatarURL({dynamic: false, format: "png"});       
let triggered = new Discord.MessageAttachment(avatar, "https://cute-api.tk/v1/generate/triggered?url=")
  message.channel.send(triggered);
  }
   
if (commande === "fuck") {
const answers = [
"https://78.media.tumblr.com/0cba71c55002cf8b25a738e6f4bdad5b/tumblr_nofw3dX5rj1uvbosmo1_500.gif",
"https://78.media.tumblr.com/a88e2331cfb1e1e290e1cb1b3b4c7ebd/tumblr_orv5n86VsE1tawcdjo1_540.gif",
"https://giant.gfycat.com/MelodicImpoliteDolphin.gif",
"https://78.media.tumblr.com/c1e12becb7e1c250ff08822eb713ff9a/tumblr_nzufvpecwa1umggj7o1_500.gif",
"https://78.media.tumblr.com/ef9bfb4ce1878686df051410145fbfa4/tumblr_n8s4coocRz1rks5xoo1_500.gif",
"https://78.media.tumblr.com/tumblr_lp0y4rMyGq1ql4hl8o1_400.gif",
"https://giant.gfycat.com/PerfectRegalEidolonhelvum.gif",
"https://78.media.tumblr.com/fb0d0310f1a4f3a4897bc2fe72e75d77/tumblr_ovd6z94a591tduf00o1_400.gif",
"https://78.media.tumblr.com/tumblr_loz4jpZHW01ql4hl8o1_500.gif",
"https://78.media.tumblr.com/0005037458c128c8b379704c1a18ce48/tumblr_o68sgosuAq1v5cpozo1_500.gif",
"https://78.media.tumblr.com/17810adb20d65b93e2dbdb09905857c1/tumblr_p04d0oXMHx1tta3uto1_500.gif",
"https://78.media.tumblr.com/44c1780a6bc905266371bf8816de94aa/tumblr_o32tbdRX3B1shq4y0o1_540.gif",
"https://78.media.tumblr.com/074d99e0269aa91fd5241e8c226e5823/tumblr_o02fm5LKzq1u2s3z9o1_500.gif",
"https://78.media.tumblr.com/76ff15334bc59fc185658082398324ca/tumblr_oqxuo1g5Ed1vottrko1_500.gif"    
]

    if (message.channel.nsfw === true) {

    const answer = answers[Math.floor(Math.random() * answers.length)];

    let embeddog = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle("🔞 **FUCK** 🔞")
    .setImage(answer)
    .setFooter("Images Fournies par https://giphy.com/gifs");

    message.channel.send(embeddog);

    message.delete();
}else {
    message.channel.send("Ce n'est pas un salon NSFW") 
}
}
   
   if (commande === "dog") {
const answers = [
    "https://media.giphy.com/media/21GCae4djDWtP5soiY/giphy.gif",
    "https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg",
    "https://media.giphy.com/media/26FPqut4lzK3AECEo/giphy.gif",
    "https://media.giphy.com/media/Y4pAQv58ETJgRwoLxj/giphy.gif",
    "https://media.giphy.com/media/ftrPtuqQUIZ5opePYS/giphy.gif",
    "https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif",
    "https://media.giphy.com/media/pcwaLYOQb3xN6/giphy.gif",
    "https://media.giphy.com/media/3o7abAHdYvZdBNnGZq/giphy.gif"
]

    if (message.channel.nsfw === true) {

    const answer = answers[Math.floor(Math.random() * answers.length)];

    let embeddog = new Discord.MessageEmbed()
    .setColor('#2F3136')
    .setTitle(`:dog: DOG :dog:\n\n\n> l'cochon ${message.author.username}`)
    .setImage(answer)
    .setFooter("Images Fournies par https://giphy.com/gifs");

    message.channel.send(embeddog);

    message.delete();
}else {
    message.channel.send("Ce n'est pas un salon NSFW") 
}
}
        
 if(commande === "groll"){
 if(!message.member.hasPermission("MANAGE_CHANNELS"))return message.channel.send("Vous n'avez pas la permission requise !");
    
        let messageID = args[0];

        bot.giveawaysManager.reroll(messageID).then(() => {
            message.channel.send("");
        }).catch((err) => {

            message.channel.send("No giveaway found for "+messageID+", please check and try again");

        });

    }
     
    if (commande === "lock") {
  if(!message.member.hasPermission("MANAGE_CHANNELS"))return message.channel.send("Vous n'avez pas la permission requise !");     
     if (!args[0]) return message.channel.send("Choisir entre `activer` ou `désactiver`")

        if (args[0] == "activer") {
            message.channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).then(g => {
                g.edit({
                    name: g.name + ' 🔒'
                })
                g.send(`🔒 | Le salon a été bloquée par ${message.author}`)
            })
        } else if(args[0] == "désactiver") {
            message.channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: null
            }).then(g => {
                g.edit({
                    name: g.name.replace(/\s*🔒/, '')
                })
                g.send(`🔓 | Salon déverrouillée avec succès`)
            })
        } else message.reply("Option invalide")
    }   
    
  if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        const duration = bdd.cooldown[message.channel.id]
        if (duration) {
            const id = `${message.channel.id}_${message.author.id}`
            if (cooldown.has(id)) {
                message.delete()
           return message.author.send(`Ce salon est soumis a un cooldown de ${humanizeDuration(duration, {language: 'fr'})}.`).then(sent => sent.delete({timeout: 5e3}))
              }                                
            cooldown.add(id)
            setTimeout(() => cooldown.delete(id), duration)
        }
    }
if (commande === "mute") {
if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à mute.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez mute le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas mute ce membre.')
        if (!member.manageable) return message.channel.send('Le bot ne peut pas mute ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie.'
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) {
            muteRole = await message.guild.roles.create({
                data: {
                    name: 'Muted',
                    permissions: 0
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }))
        }
        await member.roles.add(muteRole)
        message.channel.send(`${member} a été mute !`)
}

if (commande === "unmute") {
if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('Veuillez mentionner le membre à unmute.')
        if (member.id === message.guild.ownerID) return message.channel.send('Vous ne pouvez unmute le propriétaire du serveur.')
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send('Vous ne pouvez pas unmute ce membre.')
        if (!member.manageable) return message.channel.send('Le bot ne peut pas unmute ce membre.')
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie.'
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) return message.channel.send('Il n\'y a pas de muterole.')
        await member.roles.remove(muteRole)
        message.channel.send(`${member} a été unmute !`)
    }   

  if(message.content.startsWith(prefix + "maintenance")) {
    message.delete();
    if(!message.member.hasPermission('ADMINISTRATOR')) return;
    let roles = message.mentions.roles.first();
    if(!roles) return;
    message.guild.members.cache.forEach(member => {
      member.roles.add(roles.id)

    });
  }

  if(message.content.startsWith(prefix + "endmaintenance")) {
    message.delete();
    if(!message.member.hasPermission('ADMINISTRATOR')) return;
    let roles = message.mentions.roles.first();
    if(!roles) return;
    message.guild.members.cache.forEach(member => {
      member.roles.remove(roles.id)
    });
  }
      
    
     if (commande === "mp") {
    let embed = new Discord.MessageEmbed() 
    .setColor('#2F3136')
       message.author.send(embed)  
     }
     
    if (message.content.startsWith(prefix + "avatar")) {
 if (!message.mentions.users.size) {
            const avatar1Embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setTitle("Ton avatar")
            .setImage(`${message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
            return message.channel.send(avatar1Embed);
        }

        const avatarList = message.mentions.users.map(user => {
            const avatar2Embed = new Discord.MessageEmbed()
            .setColor('#2F3136')
            .setTitle(`L'avatar de ${user.tag}`)
            .setImage(`${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}`)
          return message.channel.send(avatar2Embed)
        });

    }
     
   if (commande === "text") {
       message.delete(); 
let args = message.content.trim().split(/ +/g);
const ms = (args.splice(1).join(' '));
             
let embed = new Discord.MessageEmbed() 
.setTitle("")
.setColor("#2f3136")
.setDescription(ms) 
message.channel.send(embed)  

}
          
    if (commande === "invites") {
      const taggedUser = message.mentions.users.first();
      if (!taggedUser) return message.reply(`mentionné un membre`)
      let embed = new Discord.MessageEmbed()
      .setTitle("📨 invites")
      .setDescription(`${taggedUser.username} has 0 invites (0 total, 0 fakes, 0 left)`) 
      .setColor("#2f3136")
      .setFooter("© Copyright 2020 - Sly_off", "https://cdn.discordapp.com/attachments/774718060862898186/781972972570935296/20201124_203735.gif")
      message.channel.send(embed)
    }
    
   if(message.content.startsWith(prefix + "ping")){
    message.channel.send("Pinging...").then(m =>{
      var ping = m.createdTimestamp - message.createdTimestamp;
      var embed = new Discord.MessageEmbed()
      .setAuthor(`Pong ! le ping est de ${ping}`)
      .setColor('#0099ff')
      m.edit(embed)
    })
    .then(msg => {
      msg.delete({ timeout: 10000 })
    })
}
 if (message.content == prefix + "test") {
  let embed = new Discord.MessageEmbed()    
  .setTitle("ceci est un test")
  .setDescription("test")
  message.channel.send(embed).then(m => {
     let embed = new Discord.MessageEmbed() 
     .setTitle("test a été edit")
     .setDescription("edit")
     m.edit(embed)
  })
 }
if (commande === "work") {
let work = [ 
"sans un centime",
"tu es clochard",
"tu es pompier",
"tu as braquer une banque tu as prix 900euro",
];     
let works = work[Math.floor(Math.random() * work.length - 1)];
message.channel.send(`${work}`)      
}

  if (message.content.startsWith(prefix + 'kick')) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick(`Kické ${user.tag}`)
          .then(() => {
            message.reply(`**:white_check_mark: L'utilisateur ${user} a bien été kick**`)
            .then(msg => {
              msg.delete({ timeout: 3000 })
            })
          })
          .catch(err => {
            message.reply("**:x: Je n'ai pas pu kicker le membre**")
            .then(msg => {
              msg.delete({ timeout: 3000 })
            })
            console.error(err);
          });
      } else {
        message.reply("**:x: Cet utilisateur n'est pas dans cette guilde !**")
            .then(msg => {
              msg.delete({ timeout: 3000 })
            })
      }
    } else {
      message.reply("**:x: Vous devez mentionner un membre à kick !**")
            .then(msg => {
              msg.delete({ timeout: 3000 })
            })
    }
  }
       
if (message.content.startsWith(prefix + "close")){
    const channel = message.channel
    if (!message.member.hasPermission('KICK_MEMBER')) return ("Vous n'avez pas la perm d'executer ceci")
    else channel.delete()
}

 if(message.content.startsWith(prefix + "nuke")){

    const pos = message.channel.position;

    if(!message.member.hasPermission("MANAGE_CHANNELS"))return message.channel.send("Vous n'avez pas la permission requise !");
    if(!message.guild.me.hasPermission("MANAGE_CHANNELS"))return message.channel.send("Je n'ai pas la permission requise !");


    message.channel.clone({reason: `Reset par ${message.member.user.username}.`}).then(ch => ch.setPosition(pos) + ch.send(`🔄 Le salon \`${ch.name}\` a été réinitialisé par **${message.member.user.username}** !`));
    message.channel.delete({reason: `Reset par ${message.member.user.username}.`});
    }
 
    if (commande === "reddit") {
     let Subreddit = message.content.slice(8);
    if (!Subreddit)
      return message.channel.send(`You did not specify your subreddit!`);
    try {
      let img = await api(Subreddit, true);
      const Embed = new Discord.MessageEmbed()
        .setTitle(`A random image from r/${Subreddit}`)
        .setColor("RANDOM")
        .setImage(img)
        .setURL(`https://reddit.com/r/${Subreddit}`);
      message.channel.send(Embed);
    } catch (err) {
      message.channel.send(err);
    }
   }
  if (message.content === prefix + "mis à jour") {
        let embed = new Discord.MessageEmbed() 
        .setTitle("♻️mis à jour")
        .setDescription("commande ajouter : (fun) + (modération)\n<a:arrow:781616679578894367> -8ball (fun)\n<a:arrow:781616679578894367> -annonce (administration)\n<a:arrow:781616679578894367> -poll (administration)\n<a:arrow:781616679578894367> -reddit (fun)\n<a:arrow:781616679578894367> -level (fun)\n<a:arrow:781616679578894367> -joinmessage (administration)\n<a:arrow:781616679578894367> -joinchannel (administration)\n<a:arrow:781616679578894367> -maintenance (modération)\n<a:arrow:781616679578894367> -tempmute(modération)\n<a:arrow:781616679578894367> -tempban(modération)\n<a:arrow:781616679578894367> -mute")
        .setColor("#2f3136")
        .setThumbnail("https://cdn.discordapp.com/avatars/764625811494928425/26650d3a7d1959ff9e7bbad408528407.png")
        .setFooter("© Copyright 2020 - Slywinter", "https://cdn.discordapp.com/avatars/764625811494928425/26650d3a7d1959ff9e7bbad408528407.png")
        message.channel.send(embed)
    }
     
  if (commande === "8ball") {
  let question = message.content.slice(6)
    if (!question)
      return message.channel.send(`You did not specify your question!`);
    else {
      let responses = [
        "Oui",
        "Non",
        "Breff",
        "oublié",
        "arrête de me poser des questions !",
      ];
      let response =
        responses[Math.floor(Math.random() * responses.length - 1)];
      let Embed = new Discord.MessageEmbed()
        .setTitle(`8Ball!`)
        .setDescription(`ta question : ${question}\nréponse : ${response}`)
        .setColor(`RANDOM`);
      message.channel.send(Embed);
    }
  }    
  
 if (commande === "poll") {
  if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send(
        `You do not have admin, ${message.author.username}`
      );
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel) {
      return message.channel.send(
        `You did not mention / give the id of your channel!`
      );
    }
    let question = message.content.split(8).join(" ");
    if (!question)
      return message.channel.send(`You did not specify your question!`);
    const Embed = new Discord.MessageEmbed()
      .setTitle(`New poll!`)
      .setDescription(`${question}`)
      .setFooter(`${message.author.username} created this poll.`)
      .setColor(`RANDOM`);
    let msg = await bot.channels.cache.get(channel.id).send(Embed);
    await msg.react("👍");
    await msg.react("👎");
  }   
     
     
 if (commande === "annonce") {
let rChannel = message.guild.channels.cache.get(args[0]);
    if (!rChannel)
      return message.channel.send(
        `You did not specify your channel to send the announcement too!`
      );
    console.log(rChannel);
    let MSG = message.content
      .split(`${bot.prefix}announce ${rChannel.id} `)
      .join("");
    if (!MSG)
      return message.channel.send(`You did not specify your message to send!`);
    const _ = new MessageEmbed()
      .setTitle(`New announcement!`)
      .setDescription(`${MSG}`)
      .setColor("RANDOM");
    rChannel.send(_);
    message.delete();
  }     
 
if (commande === "slowmode") {
    let time = message.content.split(" ").slice(1).join(" ")
    if (!time) return message.channel.send("merci d'inscrire un temps")
message.channel.setRateLimitPerUser(time);    
message.channel.send(`le slowmode a été il dure ${time}second`)  
if (err) message.channel.send("Une erreur est survenue.");  
}

  
 if (message.content == prefix + "emoji") {
       let args = message.content.trim().split(/ +/g);
       const ms = (args.splice(1).join(' '));    
     message.channel.send(`emoji name: \nemoji id: ${ms}`)
}     
     
// serveur info
    if(message.content == prefix + "serveur_info"){
        message.delete()
        var serveur_embed = new Discord.MessageEmbed()
        .setTitle("Serveur infos")
        .setFooter("demander par " + message.author.tag)
        .addField("nom du serveur : " ,message.guild.name)
        .addField("créateur du serveur : " ,"<@"+message.guild.ownerID+">")
        .addField("id du serveur : " ,message.guild.id)
        .addField("shard du serveur : " ,message.guild.shardID)
        .addField("nombre de membre : " ,message.guild.memberCount)
        .addField("région du serveur : " ,message.guild.region)
        .setColor("#2f3136")
        .setTimestamp()
        message.channel.send(serveur_embed);
    }
  if (message.content == prefix + "meme") {
    let subreddits = ["comedyheaven", "dank", "meme", "memes"];
    let subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    let img = await api(subreddit, true);
    const Embed = new Discord.MessageEmbed()
      .setTitle(`A meme from r/${subreddit}`)
      .setURL(`https://reddit.com/r/${subreddit}`)
       .setColor("#2f3136")
      .setImage(img);
    message.channel.send(Embed);
  }

// userinfo
    if(commande === "user_info"){
        message.delete()        
        var info = new Discord.MessageEmbed()
        .setTitle("Tes infos")
        .setFooter("demander par " + message.author.tag)
        .addField("ton nom : " ,message.author.username)
        .addField("ton nom et ton tag : " ,message.author.tag)
        .addField("ton id : " ,message.author.id)
        .setColor("#2f3136")
        .setTimestamp()
        message.channel.send(info)
    }
    
 if (message.content.startsWith(prefix + 'say')) {
     message.delete();
     let arg = message.content.trim().split(/ +/g);
     const ms = (arg.splice(1).join(' '));
     message.channel.send(ms);
    }
     
    if (commande === "warn") {        
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Tu n'as pas les permissions requises.")
        if (!args[0]) return message.channel.send("Vous devez mentionner quelqu'un.")
        let utilisateur = message.mentions.users.first() || message.guild.member(args[0])
        if (!bdd["warn"][utilisateur.id]) {
            bdd["warn"][utilisateur.id] = 1;
            Savebdd();
            return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissement.`)
        }
        if (bdd["warn"][utilisateur.id] == 2) {
            delete bdd["warn"][utilisateur.id]
            return message.guild.members.ban(utilisateur);

        } else {
            bdd["warn"][utilisateur.id]++
            Savebdd();
            return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissements.`)
        } 
    }
    
if(commande === "lien") {
let args = message.content.trim().split(/ +/g);
const ms = (args.splice(1).join(' '));    
let embed = new Discord.MessageEmbed() 
.setTitle("Lien commandes")
.setColor("#2f3136")
.setImage(`https://urlscan.io/liveshot/?url=${ms}`)
message.channel.send(embed)

     }
    
  if (message.content.startsWith(prefix + "invite")) {
    let embed = new Discord.MessageEmbed() 
    .setTitle("ajout-invite-Plus")
    .setAuthor("invite-Plus", message.guild.iconURL())
    .setDescription("**INVITE LE BOT SUR VOTRE SERVEUR**\ninvité le bot en cliquant ici")
    .setURL("https://discord.com/oauth2/authorize?client_id=727258130316001442&scope=bot&permissions=0")
    .setImage("https://cdn.discordapp.com/attachments/748001374624677904/772561241235390514/20201101_164129.gif")
    .setColor("#2f3136")
    message.channel.send(embed)
}  
      
if (message.content.startsWith(prefix + "setprefix")) {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous devez avoir les permissions pour pouvoir faire cette commande.")
        if (!args[0]) return message.channel.send(`Vous devez indiquer un prefix`);
        bdd[message.guild.id]["prefix"] = args[0];
        Savebdd()
        return message.channel.send(`Le prefix ${args[0]} à bien été sauvegardé !`);
    }
    
    if (commande === "clear") {
      message.delete();

        if(message.member.hasPermission("ADMINISTRATOR")){

            const args = message.content.split(" ").slice(1);

     

        if(!args[0]) return message.channel.send("Tu ne m'as pas dit combien de message je devais supprimer <a:nocheck:736755112877228052>").then(message => message.delete({ timeout: 15000 }));

        message.channel.bulkDelete(args[0]).then(() => {

            message.channel.send(`vous avez supprimer ${args[0]} messages`).then(message => message.delete({ timeout: 5000 }));

            message.delete(1000)

})}}
    
 if (commande === "ban") {
        message.delete()
        if (!message.member.hasPermission('BAN_MEMBERS')) return;
        let utilisateur = message.mentions.members.first() || message.guild.member(args[0])
        temps = args[1];
        raison = args.splice(0, 1).join(" ");
        if (!utilisateur) return message.channel.send('Vous devez mentionner un utilisateur !');
        if (!temps || isNaN(temps)) return message.channel.send('Vous devez indiquer un temps en secondes !');
        if (!raison || !args[2]) return message.channel.send('Vous devez indiquer une raison du ban !');
        message.guild.members.ban(utilisateur.id);

        }
if (message.content === prefix + "help-mod") {
const moderation = new Discord.MessageEmbed()
        .setTitle('moderation')
        .addField('`kick`', 'Kicks a member from your server via mention or ID')
        .addField('`ban`', 'Bans a member from your server via mention or ID')
        .addField('`warn`', 'Purges messages')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setColor("#2f3136")  
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('moderation')
        .addField('`clear`', 'Generates a random meme')
        .addField('`close`', 'Converts text into ascii')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setColor("#2f3136")  
        .setTimestamp()

        const pages = [
                moderation,
                fun
               
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)    
      
}
if (message.content === prefix + "help-anim") {
    message.channel.send("pas disponible")
} 

if (message.content == prefix + "help-fun") {
    const moderation = new Discord.MessageEmbed()
        .setTitle('fun')
        .addField('`nitro`', 'Kicks a member from your server via mention or ID')
        .addField('`gen`', 'Bans a member from your server via mention or ID')
        .addField('`meme`', 'Purges messages')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setColor("#2f3136")  
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('fun')
        .addField('`Mega`', 'Generates a random meme')
        .addField('`soon...`', 'Converts text into ascii')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setColor("#2f3136")  
        .setTimestamp()

        const pages = [
                moderation,
                fun
               
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)    
  
}
   
if (message.content == prefix + "help-info") {
  const moderation = new Discord.MessageEmbed()
        .setTitle('info')
        .addField('`serveur_info`', 'Kicks a member from your server via mention or ID')
        .addField('`user_info`', 'Bans a member from your server via mention or ID')
        .addField('`botInfo`', 'Purges messages')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setColor("#2f3136")  
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('moderation')
        .addField('`meme`', 'Generates a random meme')
        .addField('`ascii`', 'Converts text into ascii')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setColor("#2f3136")  
        .setTimestamp()

        const pages = [
                moderation,
                fun
               
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)    
  
}

if (message.content == prefix + "owner") {
 const moderation = new Discord.MessageEmbed()
        .setTitle('👑・commande du créateur')
        .addField('📍・tutoriels', 'Kicks a member from your server via mention or ID')
        .addField('💥・ commande général', 'Bans a member from your server via mention or ID')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('moderation')
        .addField('`meme`', 'Generates a random meme')
        .addField('`ascii`', 'Converts text into ascii')
        .setImage("https://cdn.discordapp.com/attachments/728139160648679519/780212866635661352/standard_3.gif")        
        .setTimestamp()

        const pages = [
                moderation,
                fun
               
        ]

        const emojiList = ["👑", "🗼"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)    
   
}
});

bot.on("guildCreate", async guild => {
    bdd[guild.id] = {}
    Savebdd()
});

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
} 
 
bot.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "770890593449934889") {
    if (reaction.emoji.id === "774625677676773386") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("728139159079878708")
    }
  }
 if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "772588575349800990") {
    if (reaction.emoji.name === "😪") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("772465025612513280")
    }
  }         
  if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "779389040276537404") {
    if (reaction.emoji.id === "779394800180789288") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("758840685875953664")
    }
  }       
  if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "783994846595514368") {
    if (reaction.emoji.name === "🌴") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("784228356299161640")
    }
  } 
  
  if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "784172646571966524") {
    if (reaction.emoji.id === "783503628765495387") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("784228356299161640")
    }
  }  
  //sécurity support
  if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "763479612835495948") {
    if (reaction.emoji.id === "787581485334134806") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("763479611689533469")
    }
  }  
})   

bot.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "770890593449934889") {
    if (reaction.emoji.name === "🔑") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("728139159079878708")
    }
  }
 if (user.bot) return; 
  if (!reaction.message.guild) return;
  
  if (reaction.message.channel.id === "772588575349800990") {
    if (reaction.emoji.name === "😪") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("772465025612513280")
    }
  }
  
})

bot.on("guildCreate", async gui => {
     let embed = new Discord.MessageEmbed()
   .setColor("#2f3136")  
   .setDescription(`📍Merci à ${gui.name} d'avoir ajouter Slywinter.\nNom du serveur \n**${gui.name}**\n 👤propriétaire\n<@${gui.ownerID}>\n 🌏région\n${gui.region}\n 📊nombre de membre\n${gui.memberCount}`)
     bot.guilds.cache.get("728139159041998908").channels.cache.get("774809657804849213").send(embed)
   });
bot.on("guildDelete", async gui => {
     let embed = new Discord.MessageEmbed()
   .setColor("#2f3136")  
   .setDescription(`📍Oops ${gui.name} à expulser Slywinter.\nNom du serveur \n**${gui.name}**\n📦 nombre de salon\n${gui.channelCount}\n👤propriétaire\n<@${gui.ownerID}>\n 🌏région\n${gui.region}\n 📊nombre de membre\n${gui.memberCount}`)
     bot.guilds.cache.get("728139159041998908").channels.cache.get("774809657804849213").send(embed)
   });

bot.on("messageDelete", async message => {
let channel = message.guild.channels.cache.find(ch => ch.name === "📦slywinter")    
if (!channel) return;
let embed = new Discord.MessageEmbed()
.setTitle("messageDelete") 
.setDescription(`➜ un message à été supprimé dans le salon\n➜ message de ${message.author}\n➜ message : ${message}`)
.setColor("#2f3136") 
channel.send(embed)
})

bot.on("guildMemberAdd", async member => {
let channel = member.guild.channels.cache.find(channel => channel.id === "728139161181224982")
if (!channel) return;
channel.send(`<:emoji_9:759946041947848714> bienvenue ${member} sur le serveur de Slywinter║Support\nbonne aventure !\n<:emoji_8:759946002756534304>│YouTube • https://bit.ly/3irVTZR\n <:emoji_7:759945967494889552>│Discord • Jordan_offshl#9630\n <:emoji_7:759945967494889552>│Mail • jordan2officiel@gmail.com`)    
})

bot.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
bot.on('ready', () => {
    bot.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});
bot.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);        
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '728139161181224982');
        if(welcomeChannel) {
            welcomeChannel.send(`Welcome ${member}, invited by ${usedInvite.inviter.tag} (${usedInvite.uses} Invites)`).catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});

bot.on("ready", () => {
let channel = bot.channels.cache.find(channel => channel.id === "785622696947744839")    
if (!channel) return;
let embed = new Discord.MessageEmbed() 
.setDescription("<:valid:774625677676773386>╿<@764625811494928425> désormais en ligne !")
.setColor("#2f3136")  
channel.send(embed)   
})

bot.on("messageReactionAdd", (reaction, user) => {
    if (user.bot) return
  if (reaction.message.channel.id === "785651416299339787") {
    if (reaction.emoji.name == "🎟️") {
        reaction.message.channel.send(' ');
        var TicketList = [
                "ticket-001",
                "ticket-002",
                "ticket-003"
            ]
            let result = Math.floor((Math.random() * TicketList.length))

        reaction.message.guild.channels.create(TicketList[result], {
            type: 'text',
            parent: "786686705498718248",
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
        }).then(channel_ticket => {
            let embed = new Discord.MessageEmbed()
            .setTitle("ticket")
            .setDescription(`Bonjour/bonsoir ${user.username}\n bienvenue dans votre tickets un helper ou un admin va vous repondre veillez patienter merci`)
            .setColor("#2f3136")              
            .setFooter(`ticket ouvert par ${user.username}`)            
            channel_ticket.send(`<@${user.id}>`, embed).then(async message => {
                await message.react("🔒");
            })  
        })
     }
  }
})


bot.login(token.token);