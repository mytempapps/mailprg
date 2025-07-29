const { runJob } = require('../jobRunner');
const pingCheck = require('../utils/pingCheck');
const telnetCheck = require('../utils/telnetCheck');
const diskCheck = require('../utils/diskCheck');
const sendMail = require('../mail/sendMail');
const { log } = require('../logger');

jest.mock('../utils/pingCheck');
jest.mock('../utils/telnetCheck');
jest.mock('../utils/diskCheck');
jest.mock('../mail/sendMail');
jest.mock('../logger');

describe('jobRunner', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runJob', () => {
    it('should run ping job successfully', async () => {
      const mockJob = {
        id: 'test_ping',
        type: 'ping',
        target: { ip: '127.0.0.1' }
      };

      pingCheck.mockResolvedValue({ success: true, message: 'Ping successful' });

      await runJob(mockJob);

      expect(pingCheck).toHaveBeenCalledWith(mockJob);
      expect(log).toHaveBeenCalledWith('info', 'test_ping', 'Ping successful');
      expect(sendMail).not.toHaveBeenCalled();
    });

    it('should run telnet job and send mail on failure', async () => {
      const mockJob = {
        id: 'test_telnet',
        type: 'telnet',
        target: { ip: '192.168.1.1', port: 80 },
        mail: { subject: 'Test', body: 'Test' }
      };

      telnetCheck.mockResolvedValue({ success: false, message: 'Telnet failed' });

      await runJob(mockJob);

      expect(telnetCheck).toHaveBeenCalledWith(mockJob);
      expect(log).toHaveBeenCalledWith('error', 'test_telnet', 'Telnet failed');
      expect(sendMail).toHaveBeenCalledWith(mockJob, 'Telnet failed');
    });

    it('should run disk job successfully', async () => {
      const mockJob = {
        id: 'test_disk',
        type: 'disk',
        target: { path: '/tmp', min_free_gb: 1 }
      };

      diskCheck.mockResolvedValue({ success: true, message: 'Disk check passed' });

      await runJob(mockJob);

      expect(diskCheck).toHaveBeenCalledWith(mockJob);
      expect(log).toHaveBeenCalledWith('info', 'test_disk', 'Disk check passed');
    });

    it('should handle unknown job type', async () => {
      const mockJob = {
        id: 'test_unknown',
        type: 'unknown'
      };

      await runJob(mockJob);

      expect(log).toHaveBeenCalledWith('warn', 'test_unknown', 'Bilinmeyen job tipi: unknown');
    });

    it('should handle job execution errors', async () => {
      const mockJob = {
        id: 'test_error',
        type: 'ping'
      };

      pingCheck.mockRejectedValue(new Error('Network error'));

      await runJob(mockJob);

      expect(log).toHaveBeenCalledWith('error', 'test_error', 'Hata oluştu: Network error');
    });

    it('should not send mail when job succeeds', async () => {
      const mockJob = {
        id: 'test_success',
        type: 'ping',
        target: { ip: '127.0.0.1' },
        mail: { subject: 'Test', body: 'Test' }
      };

      pingCheck.mockResolvedValue({ success: true, message: 'Success' });

      await runJob(mockJob);

      expect(sendMail).not.toHaveBeenCalled();
    });
  });
});