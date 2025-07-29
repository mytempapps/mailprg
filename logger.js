const fs = require("fs");
const path = require("path");
const settings = require("./settings.json");

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const levelThreshold = LOG_LEVELS[settings.logging.level] ?? 2;

function formatLine(level, job, message) {
  const now = new Date().toISOString();
  const fmt = settings.logging.format || "[{timestamp}] [{level}] [{job}] {message}";

  return fmt
    .replace("{timestamp}", now)
    .replace("{level}", level.toUpperCase())
    .replace("{job}", job)
    .replace("{message}", message);
}

function rotateLogsIfNeeded() {
  if (!settings.logging.log_to_file || !settings.logging.file_path) return;

  const logFile = settings.logging.file_path;
  if (!fs.existsSync(logFile)) return;

  const stats = fs.statSync(logFile);
  const maxBytes = (settings.logging.max_file_size_mb ?? 5) * 1024 * 1024;
  const maxBackups = settings.logging.max_backup_files ?? 3;

  if (stats.size < maxBytes) return;

  // log.3 silinir, log.2 → log.3, log.1 → log.2, log → log.1
  for (let i = maxBackups - 1; i >= 0; i--) {
    const src = i === 0 ? logFile : `${logFile}.${i}`;
    const dest = `${logFile}.${i + 1}`;
    if (fs.existsSync(src)) {
      try {
        fs.renameSync(src, dest);
      } catch (e) {
        console.error("Log döndürme hatası:", e.message);
      }
    }
  }
}

function log(level, job = "core", message) {
  if (!settings.logging.enabled) return;
  if (LOG_LEVELS[level] > levelThreshold) return;

  const line = formatLine(level, job, message);

  if (settings.logging.log_to_console) {
    console.log(line);
  }

  if (settings.logging.log_to_file) {
    try {
      rotateLogsIfNeeded();
      fs.appendFileSync(settings.logging.file_path, line + "\n");
    } catch (e) {
      console.error("📛 Log dosyasına yazılamadı:", e.message);
    }
  }
}

module.exports = { log };
