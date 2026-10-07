#!/usr/bin/env bash
# SSH Key Installer (modern)
# Compatible with Debian 12/13, Ubuntu 22.04/24.04 and other systemd + OpenSSH systems.
# Drop-in config is applied first (OpenSSH uses the first value it sees), and
# PubkeyAuthentication is forced on. Password login is only disabled when -d is given.
#
# Usage:
#   bash key.sh -og ClaraCora -p 2256 -d
#   bash key.sh -g ClaraCora
#   bash key.sh -u https://example.com/id_ed25519.pub -p 2222
#   bash key.sh -f ./id_ed25519.pub -U deploy
set -euo pipefail

VERSION=3.0
RED=$'\033[31m'
GREEN=$'\033[1;32m'
YELLOW=$'\033[33m'
RESET=$'\033[0m'
INFO="[${GREEN}INFO${RESET}]"
WARN="[${YELLOW}WARN${RESET}]"
ERROR="[${RED}ERROR${RESET}]"

OVERWRITE=0
KEY_ID=""
KEY_URL=""
KEY_PATH=""
SSH_PORT=""
DISABLE_PASSWORD=0
TARGET_USER=""
PUB_KEY=""
DROPIN_DIR="/etc/ssh/sshd_config.d"
DROPIN_FILE="${DROPIN_DIR}/00-key-installer.conf"
SSHD_CONFIG="/etc/ssh/sshd_config"

usage() {
    cat <<EOF
SSH Key Installer ${VERSION}

Usage:
  bash key.sh [options...]

Options:
  -o          Overwrite authorized_keys (must be placed before -g/-u/-f)
  -g <user>   Public keys from https://github.com/<user>.keys
  -u <url>    Public key from a URL
  -f <path>   Public key from a local file
  -U <user>   Install the key for this account (default: current user, or root if run via sudo)
  -p <port>   Change SSH port
  -d          Disable password and keyboard-interactive login
  -h          Show this help

Examples:
  bash key.sh -og ClaraCora -p 2256 -d
  bash key.sh -g ClaraCora
  bash key.sh -f ./id_ed25519.pub -U deploy -p 2222
EOF
}

die() {
    echo -e "${ERROR} $*" >&2
    exit 1
}

need_root() {
    if [[ ${EUID} -ne 0 ]]; then
        die "Run as root. Example: sudo bash key.sh -og ClaraCora -p 2256 -d"
    fi
}

backup_file() {
    local file=$1
    [[ -f ${file} ]] || return 0
    local dest="${file}.bak.$(date +%Y%m%d%H%M%S)"
    cp -a "${file}" "${dest}"
    echo -e "${INFO} Backup: ${dest}"
}

resolve_user() {
    if [[ -z ${TARGET_USER} ]]; then
        if [[ -n ${SUDO_USER:-} && ${SUDO_USER} != root ]]; then
            TARGET_USER=${SUDO_USER}
        else
            TARGET_USER=$(id -un)
        fi
    fi
    getent passwd "${TARGET_USER}" >/dev/null || die "User not found: ${TARGET_USER}"
    TARGET_HOME=$(getent passwd "${TARGET_USER}" | cut -d: -f6)
    [[ -n ${TARGET_HOME} && ${TARGET_HOME} != / ]] || die "Refusing empty or / home for ${TARGET_USER}"
}

valid_key() {
    [[ ${PUB_KEY} =~ ssh-(ed25519|rsa|dss|ecdsa)|sk-ssh-ed25519|sk-ecdsa ]]
}

get_github_key() {
    [[ -n ${KEY_ID} ]] || die "GitHub username is empty."
    echo -e "${INFO} Fetching keys for GitHub user ${KEY_ID}"
    PUB_KEY=$(curl -fsSL --retry 3 --max-time 20 "https://github.com/${KEY_ID}.keys" || true)
    [[ ${PUB_KEY} != "Not Found" ]] || die "GitHub account not found: ${KEY_ID}"
    [[ -n ${PUB_KEY} ]] || die "No SSH public key on GitHub account ${KEY_ID}"
    valid_key || die "GitHub did not return a usable public key."
}

get_url_key() {
    [[ -n ${KEY_URL} ]] || die "URL is empty."
    echo -e "${INFO} Fetching key from ${KEY_URL}"
    PUB_KEY=$(curl -fsSL --retry 3 --max-time 20 "${KEY_URL}" || true)
    [[ -n ${PUB_KEY} ]] || die "Empty key from URL."
    valid_key || die "URL did not return a usable public key."
}

get_local_key() {
    [[ -n ${KEY_PATH} && -f ${KEY_PATH} ]] || die "Key file not found: ${KEY_PATH}"
    PUB_KEY=$(cat "${KEY_PATH}")
    [[ -n ${PUB_KEY} ]] || die "Key file is empty."
    valid_key || die "Local file is not a public key."
}

install_key() {
    resolve_user
    local ssh_dir="${TARGET_HOME}/.ssh"
    local auth_file="${ssh_dir}/authorized_keys"
    install -d -m 700 -o "${TARGET_USER}" -g "${TARGET_USER}" "${ssh_dir}"
    touch "${auth_file}"
    chown "${TARGET_USER}:${TARGET_USER}" "${auth_file}"
    chmod 600 "${auth_file}"

    # Strip a trailing newline so we can append a single clean line.
    PUB_KEY=$(printf '%s\n' "${PUB_KEY}" | sed '/^[[:space:]]*$/d')

    if [[ ${OVERWRITE} -eq 1 ]]; then
        echo -e "${INFO} Overwriting ${auth_file}"
        printf '%s\n' "${PUB_KEY}" >"${auth_file}"
    else
        echo -e "${INFO} Adding key to ${auth_file}"
        local line
        while IFS= read -r line; do
            [[ -z ${line} ]] && continue
            grep -qxF "${line}" "${auth_file}" || printf '%s\n' "${line}" >>"${auth_file}"
        done <<<"${PUB_KEY}"
    fi
    chown "${TARGET_USER}:${TARGET_USER}" "${auth_file}"
    chmod 700 "${ssh_dir}"
    chmod 600 "${auth_file}"
    # Home must not be writable by group/other or sshd ignores the key.
    chmod go-w "${TARGET_HOME}" || true
    echo -e "${INFO} Key installed for ${TARGET_USER} (${auth_file})"
}

comment_keyword() {
    local file=$1 keyword=$2
    [[ -f ${file} ]] || return 0
    # Comment active assignments only. Leave comments and Match blocks' other lines alone.
    sed -i -E "s/^([[:space:]]*)${keyword}[[:space:]]+.*/# disabled by key-installer: &/" "${file}"
}

write_dropin() {
    need_root
    mkdir -p "${DROPIN_DIR}"
    chmod 755 "${DROPIN_DIR}"
    backup_file "${SSHD_CONFIG}"
    [[ -f ${DROPIN_FILE} ]] && backup_file "${DROPIN_FILE}"

    if ! grep -Eq '^[[:space:]]*Include[[:space:]]+/etc/ssh/sshd_config\.d/\*\.conf' "${SSHD_CONFIG}"; then
        echo -e "${INFO} Adding Include for ${DROPIN_DIR}"
        sed -i '1i Include /etc/ssh/sshd_config.d/*.conf' "${SSHD_CONFIG}"
    fi

    local tmp
    tmp=$(mktemp)
    {
        echo "# Managed by SSH Key Installer ${VERSION}. First match wins, so this file is named 00-."
        echo "PubkeyAuthentication yes"
        echo "AuthorizedKeysFile .ssh/authorized_keys"
        if [[ -n ${SSH_PORT} ]]; then
            echo "Port ${SSH_PORT}"
        fi
        if [[ ${DISABLE_PASSWORD} -eq 1 ]]; then
            echo "PasswordAuthentication no"
            echo "KbdInteractiveAuthentication no"
            echo "ChallengeResponseAuthentication no"
        fi
    } >"${tmp}"
    mv "${tmp}" "${DROPIN_FILE}"
    chmod 644 "${DROPIN_FILE}"

    # Remove competing assignments so an older "no" cannot win.
    comment_keyword "${SSHD_CONFIG}" "PubkeyAuthentication"
    comment_keyword "${SSHD_CONFIG}" "AuthorizedKeysFile"
    local extra
    shopt -s nullglob
    for extra in "${DROPIN_DIR}"/*.conf; do
        [[ ${extra} == "${DROPIN_FILE}" ]] && continue
        comment_keyword "${extra}" "PubkeyAuthentication"
        comment_keyword "${extra}" "AuthorizedKeysFile"
        if [[ -n ${SSH_PORT} ]]; then
            comment_keyword "${extra}" "Port"
        fi
        if [[ ${DISABLE_PASSWORD} -eq 1 ]]; then
            comment_keyword "${extra}" "PasswordAuthentication"
            comment_keyword "${extra}" "KbdInteractiveAuthentication"
            comment_keyword "${extra}" "ChallengeResponseAuthentication"
        fi
    done
    shopt -u nullglob
    if [[ -n ${SSH_PORT} ]]; then
        comment_keyword "${SSHD_CONFIG}" "Port"
    fi
    if [[ ${DISABLE_PASSWORD} -eq 1 ]]; then
        comment_keyword "${SSHD_CONFIG}" "PasswordAuthentication"
        comment_keyword "${SSHD_CONFIG}" "KbdInteractiveAuthentication"
        comment_keyword "${SSHD_CONFIG}" "ChallengeResponseAuthentication"
    fi
    echo -e "${INFO} Wrote ${DROPIN_FILE}"
}

open_firewall() {
    [[ -n ${SSH_PORT} ]] || return 0
    if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q 'Status: active'; then
        ufw allow "${SSH_PORT}/tcp" || echo -e "${WARN} ufw allow failed; open ${SSH_PORT}/tcp in the panel."
        echo -e "${INFO} ufw allowed ${SSH_PORT}/tcp"
    fi
    if command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
        firewall-cmd --permanent --add-port="${SSH_PORT}/tcp" || true
        firewall-cmd --reload || true
        echo -e "${INFO} firewalld allowed ${SSH_PORT}/tcp"
    fi
    echo -e "${WARN} Also open TCP ${SSH_PORT} in the cloud security group. This script cannot do that."
}

disable_socket_activation() {
    # Debian/Ubuntu socket activation ignores Port in sshd_config.
    if systemctl is-active --quiet ssh.socket 2>/dev/null; then
        echo -e "${INFO} Disabling ssh.socket so the configured port is used"
        systemctl disable --now ssh.socket
        systemctl enable ssh.service || systemctl enable sshd.service || true
    fi
}

restart_sshd() {
    disable_socket_activation
    sshd -t || die "sshd config test failed. Backups are beside the original files."
    if systemctl restart ssh 2>/dev/null; then
        echo -e "${INFO} Restarted ssh.service"
    elif systemctl restart sshd 2>/dev/null; then
        echo -e "${INFO} Restarted sshd.service"
    else
        die "Could not restart ssh or sshd."
    fi
    echo -e "${INFO} Effective config:"
    sshd -T | grep -Ei '^(port|pubkeyauthentication|passwordauthentication|kbdinteractiveauthentication|authorizedkeysfile|permitrootlogin) ' || true
}

while getopts ":og:u:f:U:p:dh" opt; do
    case ${opt} in
        o) OVERWRITE=1 ;;
        g) KEY_ID=${OPTARG} ;;
        u) KEY_URL=${OPTARG} ;;
        f) KEY_PATH=${OPTARG} ;;
        U) TARGET_USER=${OPTARG} ;;
        p) SSH_PORT=${OPTARG} ;;
        d) DISABLE_PASSWORD=1 ;;
        h) usage; exit 0 ;;
        :) die "Option -${OPTARG} needs a value." ;;
        *) usage; exit 1 ;;
    esac
done

if [[ -z ${KEY_ID}${KEY_URL}${KEY_PATH} && -z ${SSH_PORT} && ${DISABLE_PASSWORD} -eq 0 ]]; then
    usage
    exit 1
fi

if [[ -n ${SSH_PORT} ]]; then
    [[ ${SSH_PORT} =~ ^[0-9]+$ && ${SSH_PORT} -ge 1 && ${SSH_PORT} -le 65535 ]] || die "Invalid port: ${SSH_PORT}"
fi

need_root

if [[ -n ${KEY_ID} ]]; then
    get_github_key
    install_key
elif [[ -n ${KEY_URL} ]]; then
    get_url_key
    install_key
elif [[ -n ${KEY_PATH} ]]; then
    get_local_key
    install_key
fi

if [[ -n ${SSH_PORT} || ${DISABLE_PASSWORD} -eq 1 || -n ${PUB_KEY} ]]; then
    # Always force pubkey on when this script touches sshd. That is the Debian 13 failure mode.
    write_dropin
    open_firewall
    restart_sshd
fi

echo -e "${INFO} Done."
if [[ -n ${SSH_PORT} ]]; then
    echo -e "${INFO} Test from another session before closing this one:"
    echo "    ssh -p ${SSH_PORT} -i ~/.ssh/id_ed25519 ${TARGET_USER:-root}@<server-ip>"
else
    echo -e "${INFO} Test from another session before closing this one:"
    echo "    ssh -i ~/.ssh/id_ed25519 ${TARGET_USER:-root}@<server-ip>"
fi
if [[ ${DISABLE_PASSWORD} -eq 1 ]]; then
    echo -e "${WARN} Password login is now disabled. Do not close the console until key login works."
fi
