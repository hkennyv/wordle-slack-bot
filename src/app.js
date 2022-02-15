import bolt from "@slack/bolt";
import {
  SLACK_SIGNING_SECRET,
  SLACK_BOT_TOKEN,
  SLACK_APP_TOKEN,
  SLACK_WORDLE_CHANNEL,
  SLACK_DEBUG_CHANNEL,
  DEBUG,
} from "./config.js";

import { subHours, addHours, differenceInDays } from "date-fns";

const { App } = bolt;

// Wordle day 1 started on 2021-06-19 @ 0:00 PST
const DAY_ONE = new Date(Date.UTC(2021, 5, 19, 7));

const now = new Date(new Date().toUTCString());
let yesterday = subHours(now, 24);
yesterday = new Date(
  yesterday.getFullYear(),
  yesterday.getMonth(),
  yesterday.getDate()
);

// Change End time so that we could make submissions today as if it were yesterday (In DEBUG mode)
let debug_offset = DEBUG ? 24 : 0;
const yesterdayStart = yesterday.getTime() / 1000;
const yesterdayEnd = addHours(yesterday, 24 + debug_offset).getTime() / 1000;

// since we plan on running this script during the next day, subtract one
const todaysNumber = differenceInDays(now, DAY_ONE);
const yesterdaysNumber = todaysNumber - 1;

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
});

// get all messages from yesterday
const results = await app.client.conversations.history({
  channel: SLACK_WORDLE_CHANNEL,
  oldest: yesterdayStart,
  latest: yesterdayEnd,
});

const submissions = [];

for (let i = 0; i < results.messages.length; i++) {
  const message = results.messages[i];
  const match = message.text.match(/^Wordle (\d{3}) (.)\/\d.*/);

  if (!match) continue;

  const day = parseInt(match[1]);
  let score = parseInt(match[2]);
  let failed = false;
  let grid_height = score;

  // Consider games where the player failed the wordle (e.g. "Wordle 123 X/6")
  if (isNaN(score)) {
    grid_height = 6;
    failed = true;
    score = grid_height + 1;
  }

  const user = `<@${message.user}>`;
  const grid = message.text
    .split("\n")
    .slice(2, 2 + grid_height)
    .join("\n");

  const submission = { day, user, score, grid, failed };

  if (day == yesterdaysNumber) submissions.push(submission);
}

const bestScore = Math.min(
  ...submissions.map((submission) => submission.score)
);

const winners = submissions.filter(
  (submission) => submission.score === bestScore && !submission.failed
);

const greetingMessage = `*Wordle ${todaysNumber} is here, happy wordle-ing!* 📕\nhttps://www.powerlanguage.co.uk/wordle/`;

let message = "";

if (submissions.length === 0) {
  message = `Oh no! There are no submissions for Wordle ${yesterdaysNumber}, I guess everyone is a winner! :smile:`;
} else if (winners.length === 0) {
  const users = submissions.map((submission) => submission.user).join(", ");

  message =
    `You all made *${submissions.length}* submission(s) for Wordle ${yesterdaysNumber}.\n` +
    `Unfortunately, those who played today didn't successfully guess the wordle. Great job to ${users} for trying though!`;
} else if (winners.length === 1) {
  const { user, grid } = winners[0];

  message =
    `You all made *${submissions.length}* submission(s) for Wordle ${yesterdaysNumber}.\n` +
    `Great job to ${user} for getting the best score!\n\nWinning board:\n\n${user}\n${grid}`;
} else {
  const users = winners.map((winner) => winner.user).join(", ");
  const boards = winners.map((winner) => `\n\n${winner.user}\n${winner.grid}`);

  message =
    `You all made *${submissions.length}* submission(s) for Wordle ${yesterdaysNumber}\n` +
    `Great job to ${users} for getting the best score!\n\nWinning boards:${boards}`;
}

await app.client.chat.postMessage({
  channel: DEBUG ? SLACK_DEBUG_CHANNEL : SLACK_WORDLE_CHANNEL,
  text: greetingMessage,
});

await app.client.chat.postMessage({
  channel: DEBUG ? SLACK_DEBUG_CHANNEL : SLACK_WORDLE_CHANNEL,
  text: message,
});
