import dedent from 'dedent';
import { Context } from 'telegraf';

export const startAction = async (ctx: Context) => {
  return ctx.replyWithHTML(dedent`
    ⚡ Welcome to the Lightning Ping bot! ⚡

    ℹ️ <b>About</b>

    This bot helps you to check whether your lightning node is currently available and responsive on a given IP/port combination.

    📃 <b>Usage</b>

    Use the bot by sending a message like this:

    /ping <i>NODEID@HOST:PORT</i>

    ✍️ <b>Examples</b>

    <i>Clearnet Node</i>
    /ping 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@3.33.236.230:9735

    <i>Tor Node</i>
    /ping 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@of7husrflx7sforh3fw6yqlpwstee3wg5imvvmkp4bz6rbjxtg5nljad.onion:9735
  `);
};
