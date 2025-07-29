const fs = require("fs");
const path = require("path");

async function diskCheck(job) {
  const diskPath = job.target.path;
  const minFreeGB = job.target.min_free_gb;

  try {
    let stats;
    
    if (process.platform === 'win32') {
      const { execSync } = require('child_process');
      const output = execSync(`wmic logicaldisk where "deviceid='${diskPath.replace(/\\/g, '\\\\')}'" get freespace`, { encoding: 'utf8' });
      const lines = output.trim().split('\n');
      const freeBytes = parseInt(lines[lines.length - 1].trim());
      
      if (isNaN(freeBytes)) {
        throw new Error('Disk bilgisi alınamadı');
      }
      
      const freeGB = freeBytes / (1024 * 1024 * 1024);
      
      if (freeGB >= minFreeGB) {
        return {
          success: true,
          message: `Disk alanı yeterli → ${diskPath}: ${freeGB.toFixed(2)} GB boş (${minFreeGB} GB minimum)`
        };
      } else {
        return {
          success: false,
          message: `Disk alanı yetersiz → ${diskPath}: ${freeGB.toFixed(2)} GB boş, minimum ${minFreeGB} GB gerekli`
        };
      }
    } else {
      const stat = fs.statSync(diskPath);
      if (!stat.isDirectory()) {
        throw new Error('Geçersiz disk yolu');
      }
      
      const { execSync } = require('child_process');
      const output = execSync(`df -BG "${diskPath}" | tail -1`, { encoding: 'utf8' });
      const parts = output.trim().split(/\s+/);
      const freeGB = parseInt(parts[3]);
      
      if (freeGB >= minFreeGB) {
        return {
          success: true,
          message: `Disk alanı yeterli → ${diskPath}: ${freeGB} GB boş (${minFreeGB} GB minimum)`
        };
      } else {
        return {
          success: false,
          message: `Disk alanı yetersiz → ${diskPath}: ${freeGB} GB boş, minimum ${minFreeGB} GB gerekli`
        };
      }
    }

  } catch (error) {
    return {
      success: false,
      message: `Disk kontrol hatası → ${diskPath}: ${error.message}`
    };
  }
}

module.exports = diskCheck;
