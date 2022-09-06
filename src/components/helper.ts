/**
 * General helper functions.
 */

import { Context } from 'telegraf';

// Internal error messages.
export const ERR_PROMISE_TIMED_OUT = 'Promise timed out';

/**
 * Gets a list of parameters passed to the current bot command.
 */
export function getParameters(ctx: Context) {
  const update = ctx.update;
  if (update && 'message' in update) {
    const message = update.message;
    if (message && 'text' in message) {
      // Return the parameters without the leading command name.
      return message.text.split(' ').slice(1);
    }
  }
  return [];
}

/**
 * Executes a promise with a fixed deadline in milliseconds.
 * If the promise completes within this time, it will resolve as normal.
 * If the promise does not complete before the deadline, it will reject.
 */
export function promiseWithTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError = new Error(ERR_PROMISE_TIMED_OUT)
): Promise<T> {
  // Create a promise that will reject after the specified time.
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError);
    }, ms);
  });

  // Return whichever finishes first: the promise or the timeout.
  return Promise.race<T>([promise, timeout]);
}

/**
 * Checks if the given value is an error with the provided message.
 * This is necessary since TypeScript allows throwing any kind of object
 * so within a try/catch block there is no guarantee about the structure.
 */
export function isError(e: unknown, message: string) {
  return e instanceof Error && e.message == message;
}
