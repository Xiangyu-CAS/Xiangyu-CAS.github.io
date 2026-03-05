#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-start}"
PORT="${2:-4173}"
HOST="${HOST:-127.0.0.1}"
PID_FILE=".preview-${PORT}.pid"
LOG_FILE="/tmp/xiangyu-preview-${PORT}.log"

start() {
  if [[ -f "$PID_FILE" ]]; then
    local old_pid
    old_pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [[ -n "${old_pid}" ]] && kill -0 "$old_pid" 2>/dev/null; then
      echo "Already running: http://${HOST}:${PORT} (PID ${old_pid})"
      exit 0
    fi
    rm -f "$PID_FILE"
  fi

  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids="$(lsof -tiTCP:${PORT} -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
      kill $pids 2>/dev/null || true
      sleep 0.2
    fi
  fi

  nohup python3 -m http.server "$PORT" --bind "$HOST" >"$LOG_FILE" 2>&1 &
  local pid=$!
  echo "$pid" >"$PID_FILE"
  sleep 0.3

  if kill -0 "$pid" 2>/dev/null; then
    echo "Preview running: http://${HOST}:${PORT}"
    echo "PID: ${pid}"
    echo "Log: ${LOG_FILE}"
  else
    echo "Failed to start preview. Check log: ${LOG_FILE}" >&2
    exit 1
  fi
}

stop() {
  if [[ ! -f "$PID_FILE" ]]; then
    echo "Not running on port ${PORT}."
    exit 0
  fi

  local pid
  pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${pid}" ]] && kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    echo "Stopped PID ${pid}."
  else
    echo "Process already stopped."
  fi
  rm -f "$PID_FILE"
}

status() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [[ -n "${pid}" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "Running: http://${HOST}:${PORT} (PID ${pid})"
      exit 0
    fi
  fi
  echo "Not running on port ${PORT}."
}

case "$ACTION" in
  start) start ;;
  stop) stop ;;
  status) status ;;
  *)
    echo "Usage:"
    echo "  ./preview.sh [start|stop|status] [port]"
    echo "Examples:"
    echo "  ./preview.sh"
    echo "  ./preview.sh start 4173"
    echo "  ./preview.sh stop 4173"
    exit 1
    ;;
esac
