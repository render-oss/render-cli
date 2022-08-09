# render-cli #

## Installing render-cli ##
TODO: write

## Using render-cli ##
render-cli attempts to be a friendly and explorable command-line tool. For any command or subcommand under `render`, you can pass `--help` for detailed information on how it works.

Is something hard to use, unpleasant to use, or unclear? **Please let us know!** Filing an issue against this repo is super helpful, as is talking to our fantastic support team.

TODO: links ^

### Shell completions ###
TODO: write

## Environment variables ##
- `RENDERCLI_CONFIG_FILE`: the path to a render-cli configuration file. If this file does not exist, render-cli will _not_ halt (but the application may fail due to missing configuration).
- `RENDERCLI_PROFILE`: selects a profile from the Render configuration. Is overridden by the `--profile` option. Defaults to `default` if neither is set.
- `RENDERCLI_REGION`: selects a region. Is overridden by the `--region` option. Defaults to your selected profile's `defaultRegion` if neither is set, and `oregon` if your profile lacks a `defaultRegion`.
- `RENDERCLI_APIKEY`: provides an API key for use with the Render CLI. Overrides the value in your selected profile. Has no default; operations that require API access will fail if this is unset and the current profile does not have an API key.
