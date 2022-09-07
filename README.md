# LNPingBot

![Test Status](https://github.com/swissrouting/lnpingbot/actions/workflows/ci.yml/badge.svg)

**LNPingBot** ("Lightning Ping Bot") is a small Telegram bot designed to look up information about Lightning nodes.

# Usage

Chat with [@LNPingBot](https://t.me/LNPingBot) on Telegram. Use `/help` to see the available commands.

Support is available via [this Telegram group](https://t.me/LNPingBotSupport).

# Features

## /ping

Usage: `/ping PEER_PUBLIC_KEY@HOSTNAME:PORT`

This command tests whether a node is reachable on a certain IP address, hostname, or onion address.

For example, when spinning up a new Lightning node you may use this command to test whether it is running and externally reachable on the IP address set in your config file.

_Note: This is not a payment probe. The bot simply attempts to add the given node as a peer and measures the time this takes. Forwarding a payment through a node with an already established connection is entirely different and will likely be faster than the `/ping` command._

# Development

## Create Telegram Bot

Chat with [@botfather](https://telegram.me/botfather) on Telegram to create a new bot and get the secret key.

## Run Locally

First copy `.env.sample` file to `.env` and fill in the required variables. You will need to provide valid base64-encoded credentials for an LND node and the host/port for the gRPC server. You may also need to provide a base64-encoded TLS cert for the server. Here are [instructions for generating the credentials](https://github.com/alexbosworth/lightning#lnd-authentication).

Then use the following commands to spin up a local development environment:

    nix-shell
    yarn dev

The API server will be available at http://localhost:8888/api/bot

## Forward To Internet

If you want to configure a Telegram bot pointing to this backend, use ngrok:

    nix-shell
    ngrok http 8888

Then call the Telegram API to set the new backend:

    https://api.telegram.org/bot{YOUR_BOT_TOKEN}/setWebhook?url={YOUR_NGROK_DOMAIN}/api/bot

# Releases

New versions are automatically released by a CI/CD pipeline whenever the code is updated. After your pull request is merged, changes should be live within a few minutes.

If you want to run your own self-hosted version it's quite simple:

- Copy the environment variables from `.env` to your production server
- Prepare the app for deployment using `yarn build`
- Launch the app using `yarn start`

# Donations

This Telegram bot is maintained and hosted by [Swiss Routing](https://github.com/swissrouting). It costs a small amount every month to keep the backend server and Lightning node running.

If you'd like to help contribute to the hosting costs, you can send us sats.

- LNURL: [lntxbot.com/@swissrouting](https://lntxbot.com/@swissrouting)
- Lightning Address:
  swissrouting@lntxbot.com
- Keysend to Lightning node:
  `0279f06eba0e1080f6a693201f090d0635a0e5dd2ef57d0207210e3d338133092e`
