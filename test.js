const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs');
const readline = require('readline');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Konfigurasi Google Gemini AI
const genAI = new GoogleGenerativeAI("YOUR_API_KEY_GEMINI");
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Kamu adalah bot wa yang bisa menjadi teman ngobrol, curhat dan membantu semua orang, Kamu jago berbahasa Indonesia Namamu adalah BOT-DAV. Diciptakan oleh Petrus David Adi Pranata"
 });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getUserPhoneNumber() {
    return new Promise((resolve) => {
        rl.question(chalk.yellow('Masukkan nomor WhatsApp Anda (contoh: 628xxxx): '), (phoneNumber) => {
            resolve(phoneNumber.trim());
        });
    });
}

async function startBot() {
    try {
        console.log(chalk.green('Memulai WhatsApp bot...'));
        const sessionExists = fs.existsSync('./sessions/auth-state/creds.json');
        let phoneNumber = null;

        if (!sessionExists) {
            phoneNumber = await getUserPhoneNumber();
            rl.close();
        }

        const { state, saveCreds } = await useMultiFileAuthState('./sessions/auth-state');
        
        const socket = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            auth: state,
            browser: ['Ubuntu', 'Chrome', '110.0']
        });

        if (!sessionExists && !socket.authState.creds.registered) {
            console.log(chalk.yellow('Membuat kode pairing...'));
            setTimeout(async () => {
                let pairingCode = await socket.requestPairingCode(phoneNumber);
                pairingCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                console.log(chalk.green(`Kode pairing Anda: ${pairingCode}`));
            }, 3000);
        }

        socket.ev.on('creds.update', saveCreds);
        
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                console.log(chalk.red(`Terputus dengan alasan: ${reason}`));
                startBot();
            } else if (connection === 'open') {
                const userId = socket.user.id.split('@')[0].split(':')[0]; 
                console.log(chalk.green(`Bot WhatsApp terhubung! ✅\n\nSelamat datang ${socket.user.name || 'User'} (${userId})`));
            }
        });

        const conversationHistory = {};
        
        socket.ev.on('messages.upsert', async ({ messages }) => {
            for (let msg of messages) {
                if (!msg.message) return;

                const remoteJid = msg.key.remoteJid;
                const pushName = msg.pushName || "Unknown";
                const messageText = msg.message?.conversation?.trim();

                // 🛑 Cegah bot membalas dirinya sendiri
                if (msg.key.fromMe) {
                    console.log(chalk.blue('⏩ Pesan dari bot sendiri, tidak diproses.'));
                    return;
                }

                // 🛑 Cegah bot memproses pesan kosong
                if (!messageText) {
                    console.log(chalk.blue('⏩ Pesan kosong, tidak diproses.'));
                    return;
                }

                // 🛑 Cegah bot memproses pesan dari grup
                const isGroup = remoteJid.endsWith('@g.us');
                if (isGroup) {
                    console.log(chalk.blue(`⏩ Pesan dari grup ${pushName} (${remoteJid}), diabaikan.`));
                    return;
                }

                console.log(chalk.white(`================================================================`));
                console.log(chalk.yellow(`📩 Pesan dari ${pushName} (${remoteJid}): ${messageText}`));

                if (!conversationHistory[remoteJid]) {
                    conversationHistory[remoteJid] = [];
                }

                conversationHistory[remoteJid].push({ role: 'user', text: messageText });
                
                try {
                    const historyContext = conversationHistory[remoteJid].map(entry => ({
                        role: entry.role,
                        parts: [{ text: entry.text }],
                    }));
                    
                    const response = await model.generateContent({
                        contents: [
                            ...historyContext,
                            { role: 'user', parts: [{ text: messageText }] },
                        ],
                    });
                    
                    const aiReply = response.response?.candidates?.[0]?.content?.parts?.map(part => part.text).join(" ") || "Maaf, saya tidak bisa menjawab itu.";
                    conversationHistory[remoteJid].push({ role: 'assistant', text: aiReply });

                    // 🔹 Kirim balasan langsung ke chat pribadi
                    await socket.sendMessage(remoteJid, { text: aiReply });

                    console.log(chalk.green('(AI)', ': ' , JSON.stringify(aiReply, null, 2)));
                    console.log(chalk.white(`================================================================`));
                } catch (error) {
                    console.error(`❌ Terjadi kesalahan:`, error);
                    await socket.sendMessage(remoteJid, { text: "⚠️ Maaf, terjadi kesalahan dalam memproses pesan." });
                }
            }
        });
    } catch (error) {
        console.error(chalk.red('Error saat memulai bot:', error));
    }
}

startBot();
