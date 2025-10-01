export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  id: number
  time: string
  level: LogLevel
  message: string
  details?: unknown
}

type Listener = (entries: LogEntry[]) => void

const MAX_LOGS = 200
let seq = 1
let entries: LogEntry[] = []
const listeners = new Set<Listener>()

function emit() {
  for (const l of listeners) l(entries)
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  // push current state
  listener(entries)
  return () => listeners.delete(listener)
}

export function clearLogs() {
  entries = []
  emit()
}

export function log(level: LogLevel, message: string, details?: unknown) {
  const e: LogEntry = {
    id: seq++,
    time: new Date().toISOString(),
    level,
    message,
    details,
  }
  entries = [...entries.slice(-MAX_LOGS + 1), e]
  emit()
}

export const logDebug = (m: string, d?: unknown) => log('debug', m, d)
export const logInfo = (m: string, d?: unknown) => log('info', m, d)
export const logWarn = (m: string, d?: unknown) => log('warn', m, d)
export const logError = (m: string, d?: unknown) => log('error', m, d)

