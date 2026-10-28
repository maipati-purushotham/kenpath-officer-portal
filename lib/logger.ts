type Level = "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

export function log(level: Level, event: string, meta: LogMeta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...meta,
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}
