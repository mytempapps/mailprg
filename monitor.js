const fs = require("fs");
const path = require("path");
const jobRunner = require("./jobRunner");
const { log } = require("./logger");

// Pkg için gerçek dosya sistemi yolu
const isPkg = process.pkg !== undefined;
const baseDir = isPkg ? path.dirname(process.execPath) : __dirname;

// Hata ayıklama için log dosyası
function debugLog(message) {
  const timestamp = new Date().toISOString();
  const logFile = path.join(baseDir, 'logs', 'debug.log');
  const logMessage = `[${timestamp}] DEBUG: ${message}\n`;
  
  try {
    if (!fs.existsSync(path.dirname(logFile))) {
      fs.mkdirSync(path.dirname(logFile), { recursive: true });
    }
    fs.appendFileSync(logFile, logMessage);
  } catch (e) {
    console.error('Debug log hatası:', e.message);
  }
  console.log(logMessage.trim());
}

// Komut satırı parametrelerini işle
const args = process.argv.slice(2);
const jobsArg = args.find(arg => arg.startsWith('--jobs='))?.split('=')[1];
const settingsArg = args.find(arg => arg.startsWith('--settings='))?.split('=')[1];

// Gerçek dosya sistemi yolunu kullan
const defaultJobsFile = path.join(baseDir, 'config', 'jobs.json');
const defaultSettingsFile = path.join(baseDir, 'config', 'settings.json');

const jobsFile = jobsArg ? path.resolve(baseDir, jobsArg) : defaultJobsFile;
const settingsFile = settingsArg ? path.resolve(baseDir, settingsArg) : defaultSettingsFile;

debugLog(`Çalışma dizini: ${baseDir}`);
debugLog(`Jobs dosyası: ${jobsFile}`);
debugLog(`Settings dosyası: ${settingsFile}`);

// Dosyaların tam yollarını oluştur
try {
  if (!fs.existsSync(jobsFile)) {
    throw new Error(`Jobs dosyası bulunamadı: ${jobsFile}`);
  }
  
  if (!fs.existsSync(settingsFile)) {
    throw new Error(`Settings dosyası bulunamadı: ${settingsFile}`);
  }

  const jobsData = fs.readFileSync(jobsFile, 'utf-8');
  debugLog(`Jobs dosyası okundu: ${jobsFile}`);
  debugLog(`Jobs içeriği: ${jobsData.substring(0, 200)}...`);
  
  const jobsDataParsed = JSON.parse(jobsData);
  
  // Eğer jobsDataParsed object ise ve jobs property'si varsa, onu kullan
  const jobs = Array.isArray(jobsDataParsed) ? jobsDataParsed : 
               (jobsDataParsed.jobs && Array.isArray(jobsDataParsed.jobs) ? jobsDataParsed.jobs : 
               (function() { throw new Error(`Jobs dosyası geçerli bir array veya {jobs: [...]} formatında değil. Mevcut format: ${typeof jobsDataParsed}`); })());
  
  const settingsData = fs.readFileSync(settingsFile, 'utf-8');
  const settings = JSON.parse(settingsData);
  
  debugLog(`Toplam ${jobs.length} job bulundu`);
  
  // Global settings'i logger'a iletelim
  global.settings = settings;
  
  log("info", "core", `Toplam ${jobs.length} job bulundu.`);
  log("info", "core", `Jobs dosyası: ${jobsFile}`);
  log("info", "core", `Settings dosyası: ${settingsFile}`);

  for (const job of jobs) {
    setInterval(() => {
      try {
        jobRunner.runJob(job);
      } catch (jobError) {
        debugLog(`Job hatası (${job.id}): ${jobError.message}`);
      }
    }, job.interval_ms);

    log("info", job.id, `Job başlatıldı, her ${job.interval_ms} ms'de çalışacak.`);
  }
  
} catch (error) {
  debugLog(`FATAL HATA: ${error.message}`);
  debugLog(`Stack: ${error.stack}`);
  console.error('HATA:', error.message);
  console.error('Kullanım: monitor.exe --jobs=jobs.json --settings=settings.json');
  console.error(`Çalışma dizini: ${baseDir}`);
  console.error(`Beklenen dosyalar: ${jobsFile}, ${settingsFile}`);
  process.exit(1);
}