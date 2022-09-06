import dedent from 'dedent';
import { Context } from 'telegraf';

export const helpAction = async (ctx: Context) => {
  return ctx.reply(dedent`
    ⚡ Welcome to the Lightning Ping bot! ⚡

    If you need help with this bot, please contact us at https://t.me/LNPingBotSupport
  `);
};
