import pkg from 'baileys';
import pino from 'pino';
import fs from 'fs/promises';
// import { validatorWhatsapp } from '../provider/validator.js';
import prisma from '../config/prisma.db.js';

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// Hanya satu sessionId tetap
const SESSION_ID = 'single-session';

let sockInstance = null;
let qrCode = null;

export const startWhatsApp = async (io) => {
  try {
    const { state, saveCreds: origSaveCreds } = await useMultiFileAuthState(`./auth_info/${SESSION_ID}`);

    const saveCreds = async (...args) => {
      try { await origSaveCreds(...args) } catch { /* ignore */ }
    };

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      defaultQueryTimeoutMs: undefined,
      logger: pino({ level: 'silent' }),
    });

    sockInstance = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        qrCode = qr;
        io.emit('qr', { sessionId: SESSION_ID, qr });
      }

      if (connection === 'open') {
        io.emit('connected', { sessionId: SESSION_ID });
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = code === DisconnectReason.loggedOut;

        sock.ev.removeAllListeners();
        try { await sock.end() } catch {}

        sockInstance = null;
        qrCode = null;

        if (isLoggedOut) {
          await fs.rm(`./auth_info/${SESSION_ID}`, {
            recursive: true,
            force: true,
          });
          io.emit('session_invalid', { sessionId: SESSION_ID });
          await prisma.session.update({
            where: { isActive: true },
            data: { isActive: false },
          });
        } else {
          io.emit('disconnected', { sessionId: SESSION_ID });
          setTimeout(() => startWhatsApp(io), 5000);
        }
      }
    });

    sock.ev.on('messages.upsert', m => {
      io.emit('message', { sessionId: SESSION_ID, m });

      //sasas
    //   validatorWhatsapp(m, SESSION_ID);
    });

  } catch (err) {
    console.error(`Failed to start WhatsApp session:`, err);
    setTimeout(() => startWhatsApp(io), 5000);
  }
};

export const getClient = () => sockInstance;
export const getQr = () => qrCode;
