import { setup } from './setup.js';
import { Bot } from './bot/index.js';

console.clear();
console.log('>>> NECOARC BOT <<<\n');

try {
    // Configuración inicial
    const key = await setup();
    
    // Inicializar bot
    const bot = new Bot(key);
    await bot.initialize();
} catch (err: any) {
    console.log('------------------------------------');
    console.log('ERROR:');
    console.log(err?.message ?? 'Error not identified');
}
