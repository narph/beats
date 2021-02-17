#!/usr/bin/env bash
set -euo pipefail
script_path=$(dirname $(realpath -s $0))
source $script_path/helper.sh

log "INFO" "Stopping Elastic Agent"
sudo service elastic-agent stop
log "INFO" "Elastic Agent is stopped"
