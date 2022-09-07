/**
 * Functions for interacting with Lightning nodes.
 */

import { authenticatedLndGrpc } from 'lightning';

import table from 'text-table';

// Establish a connection to the backend LND node.
export const { lnd } = authenticatedLndGrpc({
  macaroon: process.env.LIGHTNING_MACAROON_B64,
  socket: process.env.LIGHTNING_HOST_PORT,
  cert: process.env.LIGHTNING_CERT_B64,
});

// TypeScript definitions for the interfaces defined in {lightning} library.
export interface Feature {
  bit: number;
  is_known: boolean;
  is_required: boolean;
  type: string;
}
export interface Socket {
  socket: string;
  type: string;
}

/**
 * Formats a list of node features into human-readable form.
 */
export const formatFeatureList = (features: Feature[]): string => {
  const header = ['TYPE', 'KNOWN', 'REQUIRED'];
  const rows = features.map((f) => [
    String(f.type),
    String(f.is_known),
    String(f.is_required),
  ]);
  return table([header, ...rows]);
};

/**
 * Formats a list of sockets into human-readable form.
 */
export const formatSocketList = (sockets: Socket[]): string =>
  sockets.map((s) => `➤ ${s.socket}`).join('\n');
