import { randomBytes, createCipheriv, CipherCCMOptions } from 'crypto';
import { readFile, writeFile, access } from 'fs/promises';
import { resolve, basename } from 'path';

export class AESFile {
    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path: string) {
        this.#path  = resolve(path);
    }

    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    async write(input: string): Promise<void> {
        const data  = Buffer.from(input, 'utf-8');
        const key   = randomBytes(16);
        const iv    = randomBytes(12);

        const cipher = createCipheriv(
            'aes-128-ccm', key, iv,
            {
                authTagLength: iv.length
            } as CipherCCMOptions
        );

        const encrypted = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]);

        const result = Buffer.concat([ key, iv, encrypted ]);
        return writeFile(this.#path, result);
    }

    async read(): Promise<string> {
        const content = await readFile(this.#path);
        if (content.length < 16 + 12) {
            throw new Error(`El archivo "${basename(this.#path)}" es inválido.`);
        }

        const key     = content.subarray(0, 16);
        const iv      = content.subarray(16, 16 + 12);
        const data    = content.subarray(16 + 12);

        const cipher = createCipheriv(
            'aes-128-ccm', key, iv,
            {
                authTagLength: iv.length
            } as CipherCCMOptions
        );

        const raw = Buffer.concat([
            cipher.update(data),
            cipher.final()
        ]);

        return raw.toString('utf-8');
    }
}