const { runJob } = require('../jobRunner');
const pingCheck = require('../utils/pingCheck');
const telnetCheck = require('../utils/telnetCheck');
const diskCheck = require('../utils/diskCheck');
const sendMail = require('../mail/sendMail');
const { log } = require('../logger');

describe('Integration Tests', () => {
  it('should complete full ping workflow', async () => {
    const job = {
      id: 'integration_ping',
      system: 'TEST',
      type: 'ping',
      target: { ip: '8.8.8.8' },
      mail: {
        subject: 'Ping Test - {system}',
        body: 'Ping test for {system} at {ip}'
      }
    };

    const result = await runJob(job);
    
    expect(result).toBeUndefined();
  });

  it('should complete full telnet workflow', async () => {
    const job = {
      id: 'integration_telnet',
      system: 'TEST',
      type: 'telnet',
      target: { ip: '127.0.0.1', port: 80 },
      mail: {
        subject: 'Telnet Test - {system}',
        body: 'Telnet test for {system} at {ip}:{port}'
      }
    };

    const result = await runJob(job);
    
    expect(result).toBeUndefined();
  });

  it('should complete full disk workflow', async () => {
    const job = {
      id: 'integration_disk',
      system: 'TEST',
      type: 'disk',
      target: { path: '/tmp', min_free_gb: 1 },
      mail: {
        subject: 'Disk Test - {system}',
        body: 'Disk test for {system} at {path}'
      }
    };

    const result = await runJob(job);
    
    expect(result).toBeUndefined();
  });
});