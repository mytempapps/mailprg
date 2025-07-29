const ping = require("ping");

async function pingCheck(job) {
  const ip = job.target.ip;

  try {
    const res = await ping.promise.probe(ip, {
      timeout: 5
    });

    if (res.alive) {
      return {
        success: true,
        message: `Ping başarılı → IP: ${ip}`
      };
    } else {
      return {
        success: false,
        message: `Ping başarısız → IP: ${ip}`
      };
    }

  } catch (error) {
    return {
      success: false,
      message: `Ping hatası → IP: ${ip}, Hata: ${error.message}`
    };
  }
}

module.exports = pingCheck;
