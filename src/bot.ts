import * as dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';

import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { startAction } from './actions/start';
import { pingAction } from './actions/ping';
import { infoAction } from './actions/info';
import { helpAction } from './actions/help';
import { donateAction } from './actions/donate';
import { promiseWithTimeout } from './components/helper';

const REQUEST_TIMEOUT_MS = 27_000; // Try to keep entire request within 30s window.

// Create bot.
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

// Set up command handlers.
bot.start(startAction);
bot.help(helpAction);
bot.command('ping', pingAction);
bot.command('info', infoAction);
bot.command('donate', donateAction);

// Add middleware to set the chat configuration (menus, etc.)
bot.use(async (ctx, next) => {
  // Always show the menu button.
  await ctx.setChatMenuButton({ type: 'commands' });
  return next();
});
bot.catch((err, ctx) => {
  console.error('Bot caught error: ', err);
  ctx.reply(
    'Unexpected error encountered. Please report this at https://t.me/LNPingBotSupport'
  );
});

// Create express app.
export const app: Express = express();
app.use(bodyParser.json());

// Define request handlers.
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
app.post('/api/bot', async (req: Request, res: Response) => {
  const body = req.body;
  console.debug('Body: ', body);
  // Check the request is valid.
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send('Request body cannot be empty');
  }
  // Handle the request.
  try {
    await promiseWithTimeout(bot.handleUpdate(body), REQUEST_TIMEOUT_MS);
    res.status(200).send({});
  } catch (e) {
    console.error('Handle request failed: ', e);
    // Pass a 200 response to Telegram so that it doesn't retry the request.
    // This means systemic errors must be caught by reviewing logs and not by
    // checking the HTTP error rate.
    res.status(200).send('Error');
  }
});
