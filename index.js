require('dotenv').config();

// =============================
//  BOT APA - ESTRUCTURA COMPLETA
// =============================
// Prefijo elegido: !
// En los siguientes mensajes iré completando cada archivo:
// index.js, config.json, comandos, botones, eventos y firmas.json.

// Este es solo el encabezado inicial.

// =============================
//  index.js - BOT APA
// =============================

const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
const clientId = process.env.CLIENT_ID;
const token = process.env.DISCORD_TOKEN;
const prefijo = process.env.PREFIJO;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();
client.buttons = new Collection();

// ============ Cargar comandos ============
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.data.name, command);
}

// ============ Cargar botones ============
const buttonsPath = path.join(__dirname, "src/buttons");
const buttonFiles = fs.readdirSync(buttonsPath).filter(f => f.endsWith(".js"));

for (const file of buttonFiles) {
    const button = require(`./src/buttons/${file}`);
    client.buttons.set(button.customId, button);
}

// ============ Cargar eventos ============
const eventsPath = path.join(__dirname, "src/events");
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// =====================================================
// LOGIN DEL BOT
// =====================================================
client.login(token);

