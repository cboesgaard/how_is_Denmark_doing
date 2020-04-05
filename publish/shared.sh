#!/usr/bin/env bash

# Shared parts for the scripts in this directory.

# Lets color a bit. This is clearly a waste of time... (setup in load function).
OUTPUTCOLOR=
NOCOLOR=
function info() {
  echo "${OUTPUTCOLOR}[${SCRIPTNAME}]${NOCOLOR} $(date +"%T.%N") INFO:" "$@"
}

function debug() {
  echo "${OUTPUTCOLOR}[${SCRIPTNAME}]${NOCOLOR} $(date +"%T.%N") DEBUG:" "$@"
}

function error() {
  echo "${OUTPUTCOLOR}[${SCRIPTNAME}]${NOCOLOR} $(date +"%T.%N") ERROR:" "$@"
}

function die() {
  error "$@"
  exit 1
}

# Check if a name of an executable is available on the path - die if not
function check_on_path() {
    for VAR in "$@"
    do
        which "$VAR" &> /dev/null || die "Unable to find executable '$VAR' on PATH - please install '$VAR'"
    done
}


# Set some variables on load
function sharedOnLoad() {
  # If tty output, lets put some colors on.
  if [ -t 1 ] ; then
    OUTPUTCOLOR=$(tput setaf 2)  # Green
    NOCOLOR=$(tput sgr0)
  fi
  check_on_path dirname readlink 
  # Set SCRIPT_DIR to this directory
  export SCRIPT_DIR=$(dirname "$(readlink -f "$0")") || die "Unable to set SCRIPT_DIR from $0"
  export PROJECT_DIR=$(dirname "$(readlink -f "${SCRIPT_DIR}")") || die "Unable to set PROJECT_DIR from ${SCRIPT_DIR}"

}
sharedOnLoad

