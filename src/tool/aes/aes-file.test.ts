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

test.serial('Encriptar "no sé leer regexpr"', async t => {
    const text = Buffer.from('no sé leer regexpr', 'utf-8');
    await file.write('no sé leer regexpr');

    const resp = await file.read();
    t.is(resp, 'no sé leer regexpr');
});

test.serial('Encriptar "😭😭😭😭"', async t => {
    await file.write('😭😭😭😭');

    const resp = await file.read();
    t.is(resp, '😭😭😭😭');
});

