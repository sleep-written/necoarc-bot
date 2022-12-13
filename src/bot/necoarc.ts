import { readdirSync } from 'fs';
import { resolve } from 'path';

export class Necoarc {
    #paths = readdirSync('audio', { withFileTypes: true })
        .filter(x => x.isFile())
        .map(x => resolve('audio', x.name));

    getRandom(): string {
        let path: string | undefined;
        while (typeof path !== 'string') {
            const rnd = Math.round(Math.random() * (this.#paths.length - 1));
            path = this.#paths.at(rnd);
        }

        return path;
    }
}