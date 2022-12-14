import test from 'ava';
import { rm } from 'fs/promises';
import { AESFile } from './aes-file.js';

const file = new AESFile('test.aes');

test.afterEach(async () => {
    await rm(file.path);
});

test.serial('Encriptar "cojone"', async t => {
    await file.write('cojone');

    const resp = await file.read();
    t.is(resp, 'cojone');
});

test.serial('Encriptar "no sÃ© leer regexpr"', async t => {
    const text = Buffer.from('no sÃ© leer regexpr', 'utf-8');
    await file.write('no sÃ© leer regexpr');

    const resp = await file.read();
    t.is(resp, 'no sÃ© leer regexpr');
});

test.serial('Encriptar "ð­ð­ð­ð­"', async t => {
    await file.write('ð­ð­ð­ð­');

    const resp = await file.read();
    t.is(resp, 'ð­ð­ð­ð­');
});

