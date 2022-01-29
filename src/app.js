import "dotenv/config";
import bolt from "@slack/bolt";

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
const yesterdayStart = yesterday.getTime() / 1000;
const yesterdayEnd = addHours(yesterday, 24).getTime() / 1000;

// since we plan on running this script during the next day, subtract one
const todaysNumber = differenceInDays(now, DAY_ONE);
const yesterdaysNumber = todaysNumber - 1;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,

  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000,
});

// get all messages from the last 24 hours
const results = await app.client.conversations.history({
  channel: process.env.SLACK_WORDLE_CHANNEL,
  oldest: yesterdayStart,
  latest: yesterdayEnd,
});

const submissions = [];

for (let i = 0; i < results.messages.length; i++) {
  const message = results.messages[i];

  const match = message.text.match(/^Wordle (\d{3}) (\d)\/\d.*/);

  if (!match) continue;

  const day = parseInt(match[1]);
  const score = parseInt(match[2]);
  const user = `<@${message.user}>`;
  const grid = message.text
    .split("\n")
    .slice(2, 2 + score)
    .join("\n");

  const submission = { day, user, score, grid };

  if (day == yesterdaysNumber) submissions.push(submission);
}

const best_score = Math.min(
  ...submissions.map((submission) => submission.score)
);

const winners = submissions.filter(
  (submission) => submission.score === best_score
);

const greetingMessage = `*Wordle ${todaysNumber} is here, happy wordle-ing!* 📕\nhttps://www.powerlanguage.co.uk/wordle/`;

const winnersMessage =
  winners.length > 1
    ? `Also, great job to ${winners
        .map((winner) => winner.user)
        .join(
          ", "
        )} on Wordle ${yesterdaysNumber}!\n\nWinning boards:${winners.map(
        (winner) => `\n\n${winner.user}\n${winner.grid}`
      )}`
    : `Also, great job to ${winners[0].user} on Wordle ${yesterdaysNumber}.\n\nWinning board:\n${winners[0].grid}`;

await app.client.chat.postMessage({
  channel: process.env.SLACK_WORDLE_CHANNEL,
  text: greetingMessage,
});

await app.client.chat.postMessage({
  channel: process.env.SLACK_WORDLE_CHANNEL,
  text: winnersMessage,
});
