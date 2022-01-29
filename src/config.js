import "dotenv/config";

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const SLACK_WORDLE_CHANNEL = process.env.SLACK_WORDLE_CHANNEL;
const SLACK_DEBUG_CHANNEL = process.env.SLACK_DEBUG_CHANNEL;

const DEBUG = process.env.DEBUG ? parseInt(process.env.DEBUG) : 0;

if (Number.isNaN(DEBUG))
  throw new Error("Environmnet variable, DEBUG, must be an integer.");

if (DEBUG && !SLACK_DEBUG_CHANNEL)
  throw new Error(
    "DEBUG is set, but SLACK_DEBUG_CHANNEL is not. This is required for DEBUG."
  );

export {
  SLACK_SIGNING_SECRET,
  SLACK_BOT_TOKEN,
  SLACK_APP_TOKEN,
  SLACK_WORDLE_CHANNEL,
  SLACK_DEBUG_CHANNEL,
  DEBUG,
};
