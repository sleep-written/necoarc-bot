import {
    AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource,
    joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus
} from '@discordjs/voice';
import { setTimeout } from 'timers/promises';
import { Message } from 'discord.js';

export class VoiceHandler {
    #connection?: VoiceConnection;
    #player?: AudioPlayer;

    isAlive(): boolean {
        return !!this.#connection && !!this.#player;
    }

    async connect(msg: Message): Promise<void> {
        const vc = msg.member?.voice?.channel;
        if (!vc) {
            throw new Error('tienes que estar en un VC para invocarme, pendejo!');
        }

        // Deploy voice connection
        const config = this.#connection?.joinConfig;
        if (
            (!this.#connection) ||
            (config?.channelId !== vc.id) ||
            (config?.guildId !== vc.guildId)
        ) {
            await new Promise<void>((resolve, reject) => {
                try {
                    this.#connection = joinVoiceChannel({
                        guildId: vc.guildId,
                        channelId: vc.id,
                        adapterCreator: vc.guild.voiceAdapterCreator
                    });
                    
                    this.#connection.on(VoiceConnectionStatus.Ready, () => {
                        resolve();
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }

        // Deplay audio player
        if (!this.#player) {
            this.#player = createAudioPlayer({
                behaviors: { noSubscriber: NoSubscriberBehavior.Play }
            });

            this.#connection?.subscribe(this.#player);
        }
    }

    play(path: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this.#connection || !this.#player) {
                throw new Error('Oye maldito aún no me dices donde conectarme joeputa!!!');
            }

            const resource = createAudioResource(path);
            this.#player.play(resource);
            await setTimeout(500);

            this.#player.on('error', err => {
                reject(err);
            });

            this.#player.on(AudioPlayerStatus.Idle, () => {
                resolve();
            });
        });
    }

    destroy(): void {
        if (this.#connection) {
            this.#connection.destroy();
            this.#connection = undefined;
        }

        if (this.#player) {
            this.#player.stop();
            this.#player = undefined;
        }
    }
}
