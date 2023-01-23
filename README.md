# render-cli #

## Getting render-cli ##
### The easy way: getting releases ###
You can download a platform-specific build of `render-cli` from the [releases page](https://github.com/render-oss/render-cli/releases).

### The easy way for OSX users: homebrew ###
```bash
brew tap render-oss/render
brew install render
```
See [render-oss/homebrew-render](https://github.com/render-oss/homebrew-render) for more details.

### The less-easy-but-still-easy way: getting builds from `main` ###
If you head to [GitHub Actions](https://github.com/render-oss/render-cli/actions) and click a passing build, you can download the latest artifacts at the bottom of the page.

### The moderately difficult way: pull the repo ###
_This is necessary to run `render-cli` on platforms not supported by `deno compile`, such as Linux `arm64`._

You can also clone this repository (fork it first, if you want!) and run the application from the repo itself. Something like this will get you sorted:

```bash
git clone git@github.com:render-oss/render-cli.git
cd render-cli
make deps

# 'deno task run' replaces 'render' in executable invocations
deno task run --help
```

To build a local binary, run `make build-local`. It will emit a platform-correct binary on supported platforms and write it
to `./bin/render`.

## Using render-cli ##
`render-cli` attempts to be a friendly and explorable command-line tool. For any command or subcommand under `render`, you can pass `--help` for detailed information on how it works.

**You'll want to get started by building a config file.** The magic words for this are `render config init`, and it'll walk you through getting set up.

Is something hard to use, unpleasant to use, or unclear? **Please let us know!** As the CLI is an open-source project, we try to work in the open as much as possible; please [check the issues](https://github.com/render-oss/render-cli/issues) and file a new one if appropriate!

### Shell completions ###
`render-cli` supports completions for `bash`, `zsh`, and `fish`. Once installed, type `render completions --help` for details.

## Environment variables ##
- `RENDERCLI_CONFIG_FILE`: the path to a render-cli configuration file. If this file does not exist, render-cli will _not_ halt (but the application may fail due to missing configuration).
- `RENDERCLI_PROFILE`: selects a profile from the Render configuration. Is overridden by the `--profile` option. Defaults to `default` if neither is set.
- `RENDERCLI_REGION`: selects a region. Is overridden by the `--region` option. Defaults to your selected profile's `defaultRegion` if neither is set, and `oregon` if your profile lacks a `defaultRegion`.
- `RENDERCLI_APIKEY`: provides an API key for use with the Render CLI. Overrides the value in your selected profile. Has no default; operations that require API access will fail if this is unset and the current profile does not have an API key.
