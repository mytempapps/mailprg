const pingCheck = require('../../utils/pingCheck');

jest.mock('ping');
const ping = require('ping');

describe('pingCheck', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return success when ping is successful', async () => {
    const mockJob = {
      target: { ip: '127.0.0.1' }
    };

    ping.promise.probe.mockResolvedValue({ alive: true });

    const result = await pingCheck(mockJob);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Ping başarılı → IP: 127.0.0.1');
    expect(ping.promise.probe).toHaveBeenCalledWith('127.0.0.1', { timeout: 5 });
  });

  it('should return failure when ping fails', async () => {
    const mockJob = {
      target: { ip: '192.168.1.999' }
    };

    ping.promise.probe.mockResolvedValue({ alive: false });

    const result = await pingCheck(mockJob);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Ping başarısız → IP: 192.168.1.999');
  });

  it('should handle ping errors gracefully', async () => {
    const mockJob = {
      target: { ip: 'invalid.ip' }
    };

    ping.promise.probe.mockRejectedValue(new Error('Network unreachable'));

    const result = await pingCheck(mockJob);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Ping hatası → IP: invalid.ip');
    expect(result.message).toContain('Network unreachable');
  });
});