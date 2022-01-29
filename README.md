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

| Environment variable | Description                                          |
| -------------------- | ---------------------------------------------------- |
| SLACK_SIGNING_SECRET | Bot signing secret credentials                       |
| SLACK_BOT_TOKEN      | Bot user token credentials                           |
| SLACK_APP_TOKEN      | App token credentials                                |
| SLACK_WORDLE_CHANNEL | The Slack channel ID to read wordle submissions from |
| SLACK_DEBUG_CHANNEL  | The Slack channel ID to post to in `DEBUG` mode      |
| DEBUG\*              | Enables `DEBUG` mode                                 |

\* optional

### Debug mode

To enable `DEBUG` mode, set the `DEBUG` environment variable to any integer
other than 0. If not set, it will default to 0.

In `DEBUG` mode, no Slack messages will be posted to `SLACK_WORDLE_CHANNEL`.
Instead, they will be posted to `SLACK_DEBUG_CHANNEL` so you can test new
features and fix bugs without disrupting others. The wordle submissions will
still be _read_ from `SLACK_WORDLE_CHANNEL` but all messages will be posted
to our `SLACK_DEBUG_CHANNEL`.

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
