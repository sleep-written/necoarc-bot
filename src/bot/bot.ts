import { Client, Message } from 'discord.js';
import { Necoarc } from './necoarc.js';
import { VoiceHandler } from './voice-handler.js';

export class Bot {
    #voiceHandler = new VoiceHandler();
    #necoarc = new Necoarc();
    #apiKey: string;
    #client: Client;

    constructor(apiKey: string) {
        this.#apiKey = apiKey;
        this.#client = new Client({
            intents: [
                'Guilds',
                'GuildMessages',
                'MessageContent',
                'DirectMessages',
                'GuildVoiceStates',
            ]
        });

        this.#client.on('ready',            this.#ready.bind(this));
        this.#client.on('messageCreate',    this.#messageCreate.bind(this));
    }

    /**
     * Inicializa el bot
     */
    async initialize(): Promise<void> {
        await this.#client.login(this.#apiKey);
    }

    #ready(): void {
        console.log(`BOT Ready!!!!`);
    }

    async #messageCreate(msg: Message<boolean>): Promise<void> {
        try {
            switch (msg.content) {
                case '&play': {
                    const vc = msg.member?.voice?.channel;
                    if (!vc) {
                        throw new Error('Tienes que estar en un VC para llamarme, pendejo!');
                    }

                    await this.#voiceHandler.connect(msg);
                    await this.#voiceHandler.play(this.#necoarc.getRandom());
                    return;
                }

                case '&stop': {
                    if (this.#voiceHandler.isAlive()) {
                        this.#voiceHandler.destroy();
                        await msg.reply('Ya era hora que me dejaras en paz marico...');
                    } else {
                        throw new Error('Tú no me das órdenes conchetumaree!!!');
                    }
                }
            }
        } catch (err: any) {
            msg.reply(err?.message ?? 'Error desconocido :C');
        }
    }
}