import dedent from 'dedent';

import { getNode } from 'lightning';
import { Context } from 'telegraf';
import { getParameters } from '../components/helper';

import {
  formatFeatureList,
  formatSocketList,
  lnd,
} from '../components/lightning';
import { GOSSIP_DELAY_NOTE, PATIENCE } from '../components/strings';

const PEER_REGEX = /([a-zA-Z0-9]{66})/;
const USAGE = 'Usage: /info PEER_PUBLIC_KEY';

export const infoAction = async (ctx: Context) => {
  const params = getParameters(ctx);

  if (params.length < 1) {
    return ctx.reply(dedent`
      Not enough arguments.
      ${USAGE}
    `);
  }

  const [inputPeer, pubkey] = PEER_REGEX.exec(params[0]) || [];

  if (!inputPeer) {
    return ctx.reply(dedent`
      Invalid input format.
      ${USAGE}
    `);
  }

  await ctx.replyWithHTML(dedent`
    Getting info for the following node:

    🔑 <b>pubkey</b>
    <pre>${encodeURIComponent(pubkey)}</pre>

    <i>${PATIENCE}</i>
  `);

  try {
    // Get basic peer info.
    const nodeInfo = await getNode({ lnd, public_key: pubkey });

    // Output this info to the user.
    await ctx.replyWithHTML(dedent`
      Here's what we know about this node from the Lightning Network ⚡️

      Alias: ${nodeInfo.alias} (Color: ${nodeInfo.color})
      Channels: ${nodeInfo.channel_count}
      Sockets:
      <pre>${formatSocketList(nodeInfo.sockets)}</pre>
      Features:
      <pre>${formatFeatureList(nodeInfo.features)}</pre>

      <i>Note: ${GOSSIP_DELAY_NOTE}</i>
    `);
  } catch (e) {
    // Log errors but don't show full details to the user.
    console.error('Failed to fetch node info: ', e);
    await ctx.reply(dedent`
      ❌ Failure
      We were unable to fetch this node info. It may not have propagated through gossip yet.
    `);
  }
};
