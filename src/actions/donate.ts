import dedent from 'dedent';
import { Context } from 'telegraf';

export const donateAction = async (ctx: Context) => {
  return ctx.replyWithHTML(dedent`
    ⚡ Are you enjoying the Lightning Ping bot? ⚡

    This bot is built by <a href="https://www.swissrouting.com">SwissRouting</a> and provided free of charge.

    If you'd like to help contribute to the hosting costs, you can send us sats.

    ➤ LNURL: <a href="https://lntxbot.com/@swissrouting">lntxbot.com/@swissrouting</a>

    ➤ Keysend to LN node: <pre>0279f06eba0e1080f6a693201f090d0635a0e5dd2ef57d0207210e3d338133092e</pre>

    ➤ Lightning Address: <pre>swissrouting@lntxbot.com</pre>
  `);
};
