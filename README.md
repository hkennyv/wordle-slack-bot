# wordle-slack-bot

This script is a Slack webhook script for the popular word game,
[Wordle](https://www.powerlanguage.co.uk/wordle/).

When run, it will:

- post a link to the current day's wordle
- read all wordle submissions from the previous day and calculate the winner(s)
  who guessed the wordle in the least amount of tries and post it to the Slack
  channel

## Configuration

You can view the [run.yml](https://github.com/hkennyv/wordle-slack-bot/blob/master/.github/workflows/run.yml)
for the most detailed information.

### Environment variables

To function properly, you need to provide valid environment variables.
More info [here](https://slack.dev/bolt-js/tutorial/getting-started).

| Environment variable | Description                       |
| -------------------- | --------------------------------- |
| SLACK_SIGNING_SECRET | Bot signing secret credentials    |
| SLACK_BOT_TOKEN      | Bot user token credentials        |
| SLACK_APP_TOKEN      | App token credentials             |
| SLACK_CHANNEL_ID     | The Slack ID to read from/post to |
| DEBUG\*              | TODO                              |

\* optional

### Development

For deveopment, you can define these environment variables in a `.env` file.
A `.env.sample` is provided that you can copy.

**DO NOT COMMIT YOUR `.env` FILE TO YOUR GIT HISTORY!**

## Running

Running is an easy two steps, assuming you have configured app properly.

### Install dependencies

You'll need node.js >=14 and npm.

```
npm install
```

### Run the script

```
npm run start
```
