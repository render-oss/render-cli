#!/usr/bin/env bash
# bash completion support for render

_render() {
  local word cur prev listFiles
  local -a opts
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"
  cmd="_"
  opts=()
  listFiles=0

  _render_complete() {
    local action="$1"; shift
    mapfile -t values < <( render completions complete "${action}" "${@}" )
    for i in "${values[@]}"; do
      opts+=("$i")
    done
  }

  _render_expand() {
    [ "$cur" != "${cur%\\}" ] && cur="$cur\\"
  
    # expand ~username type directory specifications
    if [[ "$cur" == \~*/* ]]; then
      # shellcheck disable=SC2086
      eval cur=$cur
      
    elif [[ "$cur" == \~* ]]; then
      cur=${cur#\~}
      # shellcheck disable=SC2086,SC2207
      COMPREPLY=( $( compgen -P '~' -u $cur ) )
      return ${#COMPREPLY[@]}
    fi
  }

  # shellcheck disable=SC2120
  _render_file_dir() {
    listFiles=1
    local IFS=$'\t\n' xspec #glob
    _render_expand || return 0
  
    if [ "${1:-}" = -d ]; then
      # shellcheck disable=SC2206,SC2207,SC2086
      COMPREPLY=( ${COMPREPLY[@]:-} $( compgen -d -- $cur ) )
      #eval "$glob"    # restore glob setting.
      return 0
    fi
  
    xspec=${1:+"!*.$1"}	# set only if glob passed in as $1
    # shellcheck disable=SC2206,SC2207
    COMPREPLY=( ${COMPREPLY[@]:-} $( compgen -f -X "$xspec" -- "$cur" )           $( compgen -d -- "$cur" ) )
  }

  __render() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region version commands config regions repo blueprint buildpack services deploys jobs custom-domains completions)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 1 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string ;;
      -r|--region) opts=(); _render_complete string ;;
    esac
  }

  __render_version() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string version ;;
      -r|--region) opts=(); _render_complete string version ;;
    esac
  }

  __render_commands() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string commands ;;
      -r|--region) opts=(); _render_complete string commands ;;
    esac
  }

  __render_config() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region schema init)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string config ;;
      -r|--region) opts=(); _render_complete string config ;;
    esac
  }

  __render_config_schema() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string config schema ;;
      -r|--region) opts=(); _render_complete string config schema ;;
    esac
  }

  __render_config_init() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region -f --force)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string config init ;;
      -r|--region) opts=(); _render_complete string config init ;;
      -f|--force)  ;;
    esac
  }

  __render_regions() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string regions ;;
      -r|--region) opts=(); _render_complete string regions ;;
    esac
  }

  __render_repo() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region from-template)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string repo ;;
      -r|--region) opts=(); _render_complete string repo ;;
    esac
  }

  __render_repo_from_template() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region -o --output-directory -f --force --skip-cleanup)
    _render_complete string repo from-template
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string repo from-template ;;
      -r|--region) opts=(); _render_complete string repo from-template ;;
      -o|--output-directory) opts=(); _render_complete string repo from-template ;;
      -f|--force)  ;;
      --skip-cleanup)  ;;
    esac
  }

  __render_blueprint() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region launch)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string blueprint ;;
      -r|--region) opts=(); _render_complete string blueprint ;;
    esac
  }

  __render_blueprint_launch() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region -l --link -r --remote)
    _render_complete string blueprint launch
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string blueprint launch ;;
      -r|--region) opts=(); _render_complete string blueprint launch ;;
      -l|--link)  ;;
      -r|--remote) opts=(); _render_complete string blueprint launch ;;
    esac
  }

  __render_buildpack() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region init remove add)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string buildpack ;;
      -r|--region) opts=(); _render_complete string buildpack ;;
    esac
  }

  __render_buildpack_init() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region -f --force --dir --skip-dockerfile)
    _render_complete string buildpack init
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string buildpack init ;;
      -r|--region) opts=(); _render_complete string buildpack init ;;
      -f|--force)  ;;
      --dir) opts=(); _render_complete string buildpack init ;;
      --skip-dockerfile)  ;;
    esac
  }

  __render_buildpack_remove() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --dir)
    _render_complete string buildpack remove
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string buildpack remove ;;
      -r|--region) opts=(); _render_complete string buildpack remove ;;
      --dir) opts=(); _render_complete string buildpack remove ;;
    esac
  }

  __render_buildpack_add() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --dir)
    _render_complete string buildpack add
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string buildpack add ;;
      -r|--region) opts=(); _render_complete string buildpack add ;;
      --dir) opts=(); _render_complete string buildpack add ;;
    esac
  }

  __render_services() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region show list tail ssh)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string services ;;
      -r|--region) opts=(); _render_complete string services ;;
    esac
  }

  __render_services_show() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --id)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string services show ;;
      -r|--region) opts=(); _render_complete string services show ;;
      --id) opts=(); _render_complete string services show ;;
    esac
  }

  __render_services_list() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --format --columns --name --type --env --service-region --ownerid --created-before --created-after --updated-before --updated-after)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string services list ;;
      -r|--region) opts=(); _render_complete string services list ;;
      --format) opts=(); _render_complete string services list ;;
      --columns) opts=(); _render_complete string services list ;;
      --name) opts=(); _render_complete string services list ;;
      --type) opts=(); _render_complete string services list ;;
      --env) opts=(); _render_complete string services list ;;
      --service-region) opts=(); _render_complete string services list ;;
      --ownerid) opts=(); _render_complete string services list ;;
      --created-before) opts=(); _render_complete string services list ;;
      --created-after) opts=(); _render_complete string services list ;;
      --updated-before) opts=(); _render_complete string services list ;;
      --updated-after) opts=(); _render_complete string services list ;;
    esac
  }

  __render_services_tail() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --raw --json --deploy-id --id)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string services tail ;;
      -r|--region) opts=(); _render_complete string services tail ;;
      --raw)  ;;
      --json)  ;;
      --deploy-id) opts=(); _render_complete string services tail ;;
      --id) opts=(); _render_complete string services tail ;;
    esac
  }

  __render_services_ssh() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --preserve-hosts --id)
    _render_complete string services ssh
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string services ssh ;;
      -r|--region) opts=(); _render_complete string services ssh ;;
      --preserve-hosts)  ;;
      --id) opts=(); _render_complete string services ssh ;;
    esac
  }

  __render_deploys() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region list)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string deploys ;;
      -r|--region) opts=(); _render_complete string deploys ;;
    esac
  }

  __render_deploys_list() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --format --columns --service-id --start-time --end-time)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string deploys list ;;
      -r|--region) opts=(); _render_complete string deploys list ;;
      --format) opts=(); _render_complete string deploys list ;;
      --columns) opts=(); _render_complete string deploys list ;;
      --service-id) opts=(); _render_complete string deploys list ;;
      --start-time) opts=(); _render_complete number deploys list ;;
      --end-time) opts=(); _render_complete number deploys list ;;
    esac
  }

  __render_jobs() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region list)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string jobs ;;
      -r|--region) opts=(); _render_complete string jobs ;;
    esac
  }

  __render_jobs_list() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --format --columns --service-id --status --created-before --created-after --started-before --started-after --finished-before --finished-after)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string jobs list ;;
      -r|--region) opts=(); _render_complete string jobs list ;;
      --format) opts=(); _render_complete string jobs list ;;
      --columns) opts=(); _render_complete string jobs list ;;
      --service-id) opts=(); _render_complete string jobs list ;;
      --status) opts=(); _render_complete string jobs list ;;
      --created-before) opts=(); _render_complete string jobs list ;;
      --created-after) opts=(); _render_complete string jobs list ;;
      --started-before) opts=(); _render_complete string jobs list ;;
      --started-after) opts=(); _render_complete string jobs list ;;
      --finished-before) opts=(); _render_complete string jobs list ;;
      --finished-after) opts=(); _render_complete string jobs list ;;
    esac
  }

  __render_custom_domains() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region list)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string custom-domains ;;
      -r|--region) opts=(); _render_complete string custom-domains ;;
    esac
  }

  __render_custom_domains_list() {
    opts=(-h --help -v --verbose --non-interactive --pretty-json --json-record-per-line -p --profile -r --region --format --columns --service-id --name --domain-type --verification-status --created-before --created-after)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
      -v|--verbose)  ;;
      --non-interactive)  ;;
      --pretty-json)  ;;
      --json-record-per-line)  ;;
      -p|--profile) opts=(); _render_complete string custom-domains list ;;
      -r|--region) opts=(); _render_complete string custom-domains list ;;
      --format) opts=(); _render_complete string custom-domains list ;;
      --columns) opts=(); _render_complete string custom-domains list ;;
      --service-id) opts=(); _render_complete string custom-domains list ;;
      --name) opts=(); _render_complete string custom-domains list ;;
      --domain-type) opts=(); _render_complete string custom-domains list ;;
      --verification-status) opts=(); _render_complete string custom-domains list ;;
      --created-before) opts=(); _render_complete string custom-domains list ;;
      --created-after) opts=(); _render_complete string custom-domains list ;;
    esac
  }

  __render_completions() {
    opts=(-h --help bash fish zsh)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 2 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
    esac
  }

  __render_completions_bash() {
    opts=(-h --help)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
    esac
  }

  __render_completions_fish() {
    opts=(-h --help)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
    esac
  }

  __render_completions_zsh() {
    opts=(-h --help)
    
    if [[ ${cur} == -* || ${COMP_CWORD} -eq 3 ]] ; then
      return 0
    fi
    case "${prev}" in
      -h|--help) opts=() ;;
    esac
  }

  for word in "${COMP_WORDS[@]}"; do
    case "${word}" in
      -*) ;;
      *)
        cmd_tmp="${cmd}_${word//[^[:alnum:]]/_}"
        if type "${cmd_tmp}" &>/dev/null; then
          cmd="${cmd_tmp}"
        fi
    esac
  done

  ${cmd}

  if [[ listFiles -eq 1 ]]; then
    return 0
  fi

  if [[ ${#opts[@]} -eq 0 ]]; then
    # shellcheck disable=SC2207
    COMPREPLY=($(compgen -f "${cur}"))
    return 0
  fi

  local values
  values="$( printf "\n%s" "${opts[@]}" )"
  local IFS=$'\n'
  # shellcheck disable=SC2207
  local result=($(compgen -W "${values[@]}" -- "${cur}"))
  if [[ ${#result[@]} -eq 0 ]]; then
    # shellcheck disable=SC2207
    COMPREPLY=($(compgen -f "${cur}"))
  else
    # shellcheck disable=SC2207
    COMPREPLY=($(printf '%q\n' "${result[@]}"))
  fi

  return 0
}

complete -F _render -o bashdefault -o default render
