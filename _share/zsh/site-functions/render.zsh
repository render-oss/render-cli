#!/usr/bin/env zsh
# zsh completion support for render

autoload -U is-at-least

# shellcheck disable=SC2154
(( $+functions[__render_complete] )) ||
function __render_complete {
  local name="$1"; shift
  local action="$1"; shift
  integer ret=1
  local -a values
  local expl lines
  _tags "$name"
  while _tags; do
    if _requested "$name"; then
      # shellcheck disable=SC2034
      lines="$(render completions complete "${action}" "${@}")"
      values=("${(ps:\n:)lines}")
      if (( ${#values[@]} )); then
        while _next_label "$name" expl "$action"; do
          compadd -S '' "${expl[@]}" "${values[@]}"
        done
      fi
    fi
  done
}

# shellcheck disable=SC2154
(( $+functions[_render] )) ||
function _render() {
  local state

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'version:Shows the application version.'
      'commands:Lists all commands and subcommands.'
      'config:Commands for interacting with the render-cli configuration.'
      'regions:Lists the Render regions that this version of the CLI knows about.'
      'repo:Commands for managing Render projects/repos.'
      'blueprint:Commands for interacting with Render Blueprints (render.yaml files).'
      'buildpack:Commands for using buildpacks in Render'
      'services:Commands for observing and managing Render services.'
      'deploys:Commands for observing and managing deploys of Render services.'
      'jobs:Commands for observing and managing Render jobs.'
      'custom-domains:Commands for observing and managing custom domains.'
      'completions:Generate shell completions.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      version) _render_version ;;
      commands) _render_commands ;;
      config) _render_config ;;
      regions) _render_regions ;;
      repo) _render_repo ;;
      blueprint) _render_blueprint ;;
      buildpack) _render_buildpack ;;
      services) _render_services ;;
      deploys) _render_deploys ;;
      jobs) _render_jobs ;;
      custom-domains) _render_custom_domains ;;
      completions) _render_completions ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string  ;;
    regionName-string) __render_complete regionName string  ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_version] )) ||
function _render_version() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string'

  case "$state" in
    profileName-string) __render_complete profileName string version ;;
    regionName-string) __render_complete regionName string version ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_commands] )) ||
function _render_commands() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string'

  case "$state" in
    profileName-string) __render_complete profileName string commands ;;
    regionName-string) __render_complete regionName string commands ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_config] )) ||
function _render_config() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'schema:Displays the render-cli config schema (YAML; JSON Schema format).'
      'init:Interactively creates a Render CLI config file.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      schema) _render_config_schema ;;
      init) _render_config_init ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string config ;;
    regionName-string) __render_complete regionName string config ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_config_schema] )) ||
function _render_config_schema() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string'

  case "$state" in
    profileName-string) __render_complete profileName string config schema ;;
    regionName-string) __render_complete regionName string config schema ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_config_init] )) ||
function _render_config_init() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help -f --force)'{-f,--force}'[overwrites existing files if found.]'

  case "$state" in
    profileName-string) __render_complete profileName string config init ;;
    regionName-string) __render_complete regionName string config init ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_regions] )) ||
function _render_regions() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string'

  case "$state" in
    profileName-string) __render_complete profileName string regions ;;
    regionName-string) __render_complete regionName string regions ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_repo] )) ||
function _render_repo() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'from-template:Initializes a new project repository from a template.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      from-template) _render_repo_from_template ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string repo ;;
    regionName-string) __render_complete regionName string repo ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_repo_from_template] )) ||
function _render_repo_from_template() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help -o --output-directory)'{-o,--output-directory}'[target directory for new repo]:path:->path-string' \
    '(-h --help -f --force)'{-f,--force}'[overwrites existing directory if found.]' \
    '(-h --help --skip-cleanup)'{--skip-cleanup}'[skips cleaning up tmpdir (on success or failure)]'

  case "$state" in
    profileName-string) __render_complete profileName string repo from-template ;;
    regionName-string) __render_complete regionName string repo from-template ;;
    path-string) __render_complete path string repo from-template ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_blueprint] )) ||
function _render_blueprint() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'launch:Opens the browser-based Render Deploy for the `origin` upstream for the repo (for the current working directory) or a remote repo that you'"'"'ve specified.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      launch) _render_blueprint_launch ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string blueprint ;;
    regionName-string) __render_complete regionName string blueprint ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_blueprint_launch] )) ||
function _render_blueprint_launch() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help -l --link)'{-l,--link}'[Prints out the Render Deploy URL rather than attempting to open it.]' \
    '(-h --help -r --remote)'{-r,--remote}'[The remote to use]:remoteName:->remoteName-string'

  case "$state" in
    profileName-string) __render_complete profileName string blueprint launch ;;
    regionName-string) __render_complete regionName string blueprint launch ;;
    remoteName-string) __render_complete remoteName string blueprint launch ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_buildpack] )) ||
function _render_buildpack() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'init:Initializes a repository for use with Heroku-style buildpacks within Render.'
      'remove:Removes buildpacks from your .render-buildpacks.json file.'
      'add:Adds buildpacks to your .render-buildpacks.json file.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      init) _render_buildpack_init ;;
      remove) _render_buildpack_remove ;;
      add) _render_buildpack_add ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string buildpack ;;
    regionName-string) __render_complete regionName string buildpack ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_buildpack_init] )) ||
function _render_buildpack_init() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help -f --force)'{-f,--force}'[overwrites existing files if found.]' \
    '(-h --help --dir)'{--dir}'[the directory in which to run this command]:string:->string-string' \
    '(-h --help --skip-dockerfile)'{--skip-dockerfile}'[don'"'"'t emit a Dockerfile]'

  case "$state" in
    profileName-string) __render_complete profileName string buildpack init ;;
    regionName-string) __render_complete regionName string buildpack init ;;
    string-string) __render_complete string string buildpack init ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_buildpack_remove] )) ||
function _render_buildpack_remove() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --dir)'{--dir}'[the directory in which to run this command]:string:->string-string'

  case "$state" in
    profileName-string) __render_complete profileName string buildpack remove ;;
    regionName-string) __render_complete regionName string buildpack remove ;;
    string-string) __render_complete string string buildpack remove ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_buildpack_add] )) ||
function _render_buildpack_add() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --dir)'{--dir}'[the directory in which to run this command]:string:->string-string'

  case "$state" in
    profileName-string) __render_complete profileName string buildpack add ;;
    regionName-string) __render_complete regionName string buildpack add ;;
    string-string) __render_complete string string buildpack add ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_services] )) ||
function _render_services() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'show:Fetches full details about a single service.'
      'list:Lists the services this user can see.'
      'tail:Tails logs for a given service.'
      'ssh:Opens a SSH session to a Render service.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      show) _render_services_show ;;
      list) _render_services_list ;;
      tail) _render_services_tail ;;
      ssh) _render_services_ssh ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string services ;;
    regionName-string) __render_complete regionName string services ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_services_show] )) ||
function _render_services_show() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --id)'{--id}'[the service ID (e.g. `srv-12345`)]:serviceId:->serviceId-string'

  case "$state" in
    profileName-string) __render_complete profileName string services show ;;
    regionName-string) __render_complete regionName string services show ;;
    serviceId-string) __render_complete serviceId string services show ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_services_list] )) ||
function _render_services_list() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --format)'{--format}'[interactive output format]:fmt:->fmt-string' \
    '(-h --help --columns)'{--columns}'[if --format table, the columns to show.]:cols:->cols-string' \
    '(-h --help)'{*--name}'[the name of a service to filter by]:name:->name-string' \
    '(-h --help)'{*--type}'[the service type to filter by]:type:->type-string' \
    '(-h --help)'{*--env}'[the runtime environment (docker, ruby, python, etc.)]:env:->env-string' \
    '(-h --help)'{*--service-region}'[the region in which a service is located]:svc:->svc-string' \
    '(-h --help)'{*--ownerid}'[the owner ID for the service]:ownerId:->ownerId-string' \
    '(-h --help --created-before)'{--created-before}'[services created before (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --created-after)'{--created-after}'[services created after (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --updated-before)'{--updated-before}'[services updated before (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --updated-after)'{--updated-after}'[services updated after (ISO8601)]:datetime:->datetime-string'

  case "$state" in
    profileName-string) __render_complete profileName string services list ;;
    regionName-string) __render_complete regionName string services list ;;
    fmt-string) __render_complete fmt string services list ;;
    cols-string) __render_complete cols string services list ;;
    name-string) __render_complete name string services list ;;
    type-string) __render_complete type string services list ;;
    env-string) __render_complete env string services list ;;
    svc-string) __render_complete svc string services list ;;
    ownerId-string) __render_complete ownerId string services list ;;
    datetime-string) __render_complete datetime string services list ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_services_tail] )) ||
function _render_services_tail() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --raw)'{--raw}'[only prints the bare text of the log to stdout]' \
    '(-h --help --raw --json)'{--json}'[prints Render'"'"'s log tail as JSON, one per message]' \
    '(-h --help)'{*--deploy-id}'[filter logs to the requested deploy ID]:deployId:->deployId-string' \
    '(-h --help --id)'{--id}'[the service ID whose logs to request]:serviceId:->serviceId-string'

  case "$state" in
    profileName-string) __render_complete profileName string services tail ;;
    regionName-string) __render_complete regionName string services tail ;;
    deployId-string) __render_complete deployId string services tail ;;
    serviceId-string) __render_complete serviceId string services tail ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_services_ssh] )) ||
function _render_services_ssh() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --preserve-hosts)'{--preserve-hosts}'[Do not update ~/.ssh/known_hosts with Render public keys.]' \
    '(-h --help --id)'{--id}'[The service ID to access via SSH.]:serviceId:->serviceId-string'

  case "$state" in
    profileName-string) __render_complete profileName string services ssh ;;
    regionName-string) __render_complete regionName string services ssh ;;
    serviceId-string) __render_complete serviceId string services ssh ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_deploys] )) ||
function _render_deploys() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'list:Lists the deploys for a given service.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      list) _render_deploys_list ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string deploys ;;
    regionName-string) __render_complete regionName string deploys ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_deploys_list] )) ||
function _render_deploys_list() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --format)'{--format}'[interactive output format]:fmt:->fmt-string' \
    '(-h --help --columns)'{--columns}'[if --format table, the columns to show.]:cols:->cols-string' \
    '(-h --help --service-id)'{--service-id}'[the service whose deploys to retrieve]:serviceId:->serviceId-string' \
    '(-h --help --start-time)'{--start-time}'[start of the time range to return]:timestamp:->timestamp-number' \
    '(-h --help --end-time)'{--end-time}'[end of the time range to return]:timestamp:->timestamp-number'

  case "$state" in
    profileName-string) __render_complete profileName string deploys list ;;
    regionName-string) __render_complete regionName string deploys list ;;
    fmt-string) __render_complete fmt string deploys list ;;
    cols-string) __render_complete cols string deploys list ;;
    serviceId-string) __render_complete serviceId string deploys list ;;
    timestamp-number) __render_complete timestamp number deploys list ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_jobs] )) ||
function _render_jobs() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'list:Lists the jobs this user can see.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      list) _render_jobs_list ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string jobs ;;
    regionName-string) __render_complete regionName string jobs ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_jobs_list] )) ||
function _render_jobs_list() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --format)'{--format}'[interactive output format]:fmt:->fmt-string' \
    '(-h --help --columns)'{--columns}'[if --format table, the columns to show.]:cols:->cols-string' \
    '(-h --help --service-id)'{--service-id}'[the service whose deploys to retrieve]:serviceId:->serviceId-string' \
    '(-h --help)'{*--status}'['"'"'pending'"'"', '"'"'running'"'"', '"'"'succeeded'"'"', or '"'"'failed'"'"']:status:->status-string' \
    '(-h --help --created-before)'{--created-before}'[jobs created before (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --created-after)'{--created-after}'[jobs created after (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --started-before)'{--started-before}'[jobs started before (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --started-after)'{--started-after}'[jobs started after (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --finished-before)'{--finished-before}'[jobs finished before (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --finished-after)'{--finished-after}'[jobs finished after (ISO8601)]:datetime:->datetime-string'

  case "$state" in
    profileName-string) __render_complete profileName string jobs list ;;
    regionName-string) __render_complete regionName string jobs list ;;
    fmt-string) __render_complete fmt string jobs list ;;
    cols-string) __render_complete cols string jobs list ;;
    serviceId-string) __render_complete serviceId string jobs list ;;
    status-string) __render_complete status string jobs list ;;
    datetime-string) __render_complete datetime string jobs list ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_custom_domains] )) ||
function _render_custom_domains() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'list:Lists the custom domains for a given service.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      list) _render_custom_domains_list ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
    profileName-string) __render_complete profileName string custom-domains ;;
    regionName-string) __render_complete regionName string custom-domains ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_custom_domains_list] )) ||
function _render_custom_domains_list() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '(-h --help -v --verbose)'{-v,--verbose}'[Makes render-cli a lot more chatty.]' \
    '(-h --help --non-interactive)'{--non-interactive}'[Forces Render to act as though it'"'"'s not in a TTY.]' \
    '(-h --help --pretty-json)'{--pretty-json}'[If in non-interactive mode, prints prettified JSON.]' \
    '(-h --help --pretty-json --json-record-per-line)'{--json-record-per-line}'[if emitting JSON, prints each JSON record as a separate line of stdout.]' \
    '(-h --help -p --profile)'{-p,--profile}'[The Render profile to use for this invocation. Overrides RENDERCLI_PROFILE.]:profileName:->profileName-string' \
    '(-h --help -r --region)'{-r,--region}'[The Render region to use for this invocation; always accepted but not always relevant. Overrides RENDERCLI_REGION.]:regionName:->regionName-string' \
    '(-h --help --format)'{--format}'[interactive output format]:fmt:->fmt-string' \
    '(-h --help --columns)'{--columns}'[if --format table, the columns to show.]:cols:->cols-string' \
    '(-h --help --service-id)'{--service-id}'[the service whose deploys to retrieve]:serviceId:->serviceId-string' \
    '(-h --help)'{*--name}'[domain names to filter by]:name:->name-string' \
    '(-h --help)'{*--domain-type}'['"'"'apex'"'"' or '"'"'subdomain'"'"']:name:->name-string' \
    '(-h --help)'{*--verification-status}'['"'"'verified'"'"' or '"'"'unverified'"'"']:name:->name-string' \
    '(-h --help --created-before)'{--created-before}'[services created before (ISO8601)]:datetime:->datetime-string' \
    '(-h --help --created-after)'{--created-after}'[services created after (ISO8601)]:datetime:->datetime-string'

  case "$state" in
    profileName-string) __render_complete profileName string custom-domains list ;;
    regionName-string) __render_complete regionName string custom-domains list ;;
    fmt-string) __render_complete fmt string custom-domains list ;;
    cols-string) __render_complete cols string custom-domains list ;;
    serviceId-string) __render_complete serviceId string custom-domains list ;;
    name-string) __render_complete name string custom-domains list ;;
    datetime-string) __render_complete datetime string custom-domains list ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_completions] )) ||
function _render_completions() {

  function _commands() {
    local -a commands
    # shellcheck disable=SC2034
    commands=(
      'bash:Generate shell completions for bash.'
      'fish:Generate shell completions for fish.'
      'zsh:Generate shell completions for zsh.'
    )
    _describe 'command' commands
  }

  function _command_args() {
    case "${words[1]}" in
      bash) _render_completions_bash ;;
      fish) _render_completions_fish ;;
      zsh) _render_completions_zsh ;;
    esac
  }

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]' \
    '1:command:_commands' \
    '*::sub command:->command_args'

  case "$state" in
    command_args) _command_args ;;
  esac
}

# shellcheck disable=SC2154
(( $+functions[_render_completions_bash] )) ||
function _render_completions_bash() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]'
}

# shellcheck disable=SC2154
(( $+functions[_render_completions_fish] )) ||
function _render_completions_fish() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]'
}

# shellcheck disable=SC2154
(( $+functions[_render_completions_zsh] )) ||
function _render_completions_zsh() {

  _arguments -w -s -S -C \
    '(- *)'{-h,--help}'[Show this help.]'
}

# _render "${@}"

compdef _render render
