const net = require("net");

async function telnetCheck(job) {
  const ip = job.target.ip;
  const port = job.target.port;

  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000;

    const timer = setTimeout(() => {
      socket.destroy();
      resolve({
        success: false,
        message: `Telnet bağlantısı zaman aşımına uğradı → IP: ${ip}, Port: ${port}`
      });
    }, timeout);

    socket.connect(port, ip, () => {
      clearTimeout(timer);
      socket.destroy();
      resolve({
        success: true,
        message: `Telnet bağlantısı başarılı → IP: ${ip}, Port: ${port}`
      });
    });

    socket.on('error', (error) => {
      clearTimeout(timer);
      resolve({
        success: false,
        message: `Telnet bağlantısı başarısız → IP: ${ip}, Port: ${port}, Hata: ${error.message}`
      });
    });
  });
}

module.exports = telnetCheck;
