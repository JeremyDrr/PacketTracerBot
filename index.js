const Discord = require("discord.js");
const Client = new Discord.Client;
const config = require("./config.json");
var fs = require("fs");

// Gestion du Bot au lancement
Client.on("ready", () => {
    console.log("Le bot s'est lançé avec succès!")

    // Mise en place d'une activité custom
    Client.user.setActivity("les tutos de Jakes", {
        type: "LISTENING",
      });

      // Mise en mémoire du message du règlement
      Client.guilds.cache.find(guild => guild.id === config.serverID).channels.cache.find(channel => channel.id === config.rulesChannel).messages.fetch(config.rulesMessage).then(message => {
        console.log("Le message de règles à été retrouvé et sauvegardé dans la mémoire!");
    }).catch(err => {
        console.log("Impossible de retrouver et de sauvegarder le message de règles dans la mémoire!")
    });
});


// Gestion à l'arrivé d'un membre
Client.on("guildMemberAdd", member => {
    console.log("Un nouveau membre est arrivé (" + member.displayName + ")\nNombre de membres: " + member.guild.memberCount);
    member.send("Bienvenue sur le serveur Magic SNIR! Lit les règles et valide-les avant de pouvoir accéder aux autres salons du serveur!");
    member.guild.channels.cache.find(channel => channel.id === config.welcomeChannel).send("Bienvenue " + member.toString + " sur le serveur **Magic SNIR** :smiley:");
});

// Gestion du départ d'un membre
Client.on("guildMemberRemove", member => {
    console.log("Un membre est parti (" + member.displayName + ")\nNombre de membres: " + member.guild.memberCount)
});

// Gestion de l'auto affectation des rôles lors de la validation des règles
Client.on("messageReactionAdd", async (reaction, user) => {
    if(reaction.emoji.name === "✅" && reaction.message.id === config.rulesMessage){

        console.log("Approbation des règles par " + user.username.toString() + " (N°" + reaction.count + ")");
        let role = reaction.message.guild.roles.cache.get(config.friendRole);
        let member = reaction.message.guild.members.cache.get(user.id);

        if(role && member){
            member.roles.add(role);
        }
    }
});

Client.on("messageReactionRemove", async (reaction, user) => {
    if(reaction.emoji.name === "✅" && reaction.message.id === config.rulesMessage){

        console.log("Déspprobation des règles par " + user.username.toString());
        let role = reaction.message.guild.roles.cache.get(config.friendRole);
        let member = reaction.message.guild.members.cache.get(user.id);

        if(role && member){
            member.roles.remove(role);
        }
    }
});

// Gestion lors de l'envoie d'un message
Client.on("message", message => {
    if(message.author.bot || message.channel.type == "dm" || !message.content.startsWith(config.prefix)) return;

    // Si l'aministrateur envoie la commande "!rules" dans le channel dédié
    if(message.content == "!rules" && message.author.id == config.adminID && message.channel.id == config.rulesChannel){
        message.delete();

        // Création d'un message embed
        const rulesEmbed = new Discord.MessageEmbed()
        .setColor("#3a98e9")
        .setTitle("**Bienvenue sur le serveur Magic SNIR**")
        .setURL("https://netacad.com/")
        .setDescription("Blah Blah Blah (à définir)")
        .setThumbnail("https://cdn.discordapp.com/icons/421694598889472010/c48d9cde20c59efb14fd012f3ba04abf.webp?size=1024")
        .addFields(
            {name: "\u200B", value: "\u200B"},
            {name: "A définir", value: "A définir"},
            {name: "A définir", value: "A définir"},
            {name: "A définir", value: "A définir"},
            {name: "A définir", value: "A définir"},
            {name: "A définir", value: "A définir"},
        )

        var configs = JSON.parse(fs.readFileSync("./config.json"));

        // Ajouter une réaction au message de règle + le sauvegarder dans la mémoire
        message.channel.send(rulesEmbed).then(embedMessage => {
            configs["rulesMessage"] = "" + embedMessage.id;
            const json = JSON.stringify(configs);
            fs.writeFile("./config.json", json, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        console.log("Mise à jour avec succès du message des règles!");
        embedMessage.react("✅");
        });

    }
});

// Connexion du Bot au serveur
Client.login(config.token);