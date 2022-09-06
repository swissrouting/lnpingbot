import dedent from 'dedent';

import { addPeer, getNode, removePeer } from 'lightning';
import { Context } from 'telegraf';

import {
  ERR_PROMISE_TIMED_OUT,
  getParameters,
  isError,
  promiseWithTimeout,
} from '../components/helper';
import { formatSocketList, lnd } from '../components/lightning';
import { GOSSIP_DELAY_NOTE, PROBE_NOTE } from '../components/strings';

const CONNECT_TIMEOUT_SECS = 20;
const PEER_REGEX = /([a-zA-Z0-9]{66})@(.+):([0-9]{1,5})/;
const USAGE = 'Usage: /ping PEER_PUBLIC_KEY@HOSTNAME:PORT';

export const pingAction = async (ctx: Context) => {
  const params = getParameters(ctx);

  if (params.length < 1) {
    return ctx.reply(dedent`
      Not enough arguments.
      ${USAGE}
    `);
  }

  const inputParam = params[0].trim();
  const [inputPeer, pubkey, hostname, port] = PEER_REGEX.exec(inputParam) || [];

  const socket = `${hostname}:${port}`;

  if (!inputPeer) {
    return ctx.reply(dedent`
      Invalid input format.
      ${USAGE}
    `);
  }

  await ctx.replyWithHTML(dedent`
    Trying to connect to the following lightning node:

    🔑 <b>pubkey</b>
    <pre>${encodeURIComponent(pubkey)}</pre>
    💻 <b>hostname</b>
    <pre>${encodeURIComponent(hostname)}</pre>
    ⚓ <b>port</b>
    <pre>${encodeURIComponent(port)}</pre>

    <i>Note: ${PROBE_NOTE}</i>

    <i>Please be patient - this could take up to ${CONNECT_TIMEOUT_SECS} seconds</i> ⌛
  `);

  // Silently disconnect from peer in case we were already connected.
  console.info('Disconnecting from peer: ', inputPeer);
  try {
    await removePeer({ lnd, public_key: pubkey });
    console.info('Successfully disconnected from peer: ', inputPeer);
  } catch (e) {
    // This is normal and expected behaviour; log it anyway.
    console.warn('Failed to disconnect from peer: ', inputPeer, 'Reason: ', e);
  }

  try {
    // Connect to peer (and time it).
    console.info('Connecting to peer: ', inputPeer);
    const startTime = new Date().getTime();
    await promiseWithTimeout(
      addPeer({
        lnd,
        is_temporary: true,
        public_key: pubkey,
        socket: socket,
        retry_count: 0,
        timeout: CONNECT_TIMEOUT_SECS,
      }),
      // Force timeout after this period, since we can't guarantee that the
      // backend will respect the timeout parameter passed.
      CONNECT_TIMEOUT_SECS * 1000
    );
    const endTime = new Date().getTime();

    // Get basic peer info.
    const nodeInfo = await getNode({ lnd, public_key: pubkey });

    // Output this info to the user.
    await ctx.replyWithHTML(dedent`
      ✅ Success
      Connected in: ${endTime - startTime}ms

      Alias: ${nodeInfo.alias}
      Channels: ${nodeInfo.channel_count}
      Sockets:
      <pre>${formatSocketList(nodeInfo.sockets)}</pre>

      <i>Note: ${GOSSIP_DELAY_NOTE}</i>
      
      Use the /info command to fetch more details about this node.
    `);
  } catch (e) {
    // Log errors but don't show full details to the user.
    console.error('Failed to connect: ', e);

    // Try to explain the error better when we understand the cause.
    let explanation =
      'Check that the pubkey, host, and port number are correct and try again.';
    if (isError(e, ERR_PROMISE_TIMED_OUT)) {
      explanation = `We gave up after ${CONNECT_TIMEOUT_SECS} seconds. It's possible the node may be online but just slow to respond.`;
    }
    await ctx.reply(dedent`
      ❌ Failure
      We were unable to connect to this node.
      ${explanation}
    `);
  }
};
