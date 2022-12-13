import promps from 'prompts';
import { AESFile } from './tool/aes/index.js';

/**
 * Revisa si el archivo con la llave existe, si lo cuenta y es válido,
 * la retorna. En caso contrario, solicita nuevas claves al usuario.
 */
export async function setup(): Promise<string> {
    let file = new AESFile('api-key.aes');
    console.log('Revisando "api-key.aes"...');
    if (await file.exists()) {
        const apiKey = await file.read();
        if (apiKey.length === 72) {
            return apiKey;
        }

        console.log('Archivo "api-key.aes" inválido detectado!');
    }

    const resp = await promps({
        name: 'apiKey',
        type: 'password',
        message: 'Ingrese su API KEY',
        mask: '•',
        validate: (x?: string) => {
            const txt = x?.replace(/\s/gi, '');
            if ((txt ?? '').length !== 72) {
                return 'Un API Key debe de tener 72 caracteres';
            } else {
                return true;
            }
        }
    });

    const apiKey = resp?.apiKey?.replace(/\s/gi, '');
    if (!apiKey) { process.exit(666); }

    await file.write(apiKey);
    console.log('API KEY creada correctamente!');
    return apiKey;
}