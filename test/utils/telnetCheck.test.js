const telnetCheck = require('../../utils/telnetCheck');
const net = require('net');

jest.mock('net');

const mockSocket = {
  connect: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn()
};

net.Socket.mockImplementation(() => mockSocket);

describe('telnetCheck', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return success when telnet connection is successful', async () => {
    const mockJob = {
      target: { ip: '127.0.0.1', port: 80 }
    };

    const resultPromise = telnetCheck(mockJob);

    const connectCallback = mockSocket.connect.mock.calls[0][2];
    connectCallback();

    const result = await resultPromise;

    expect(result.success).toBe(true);
    expect(result.message).toContain('Telnet bağlantısı başarılı → IP: 127.0.0.1, Port: 80');
    expect(mockSocket.connect).toHaveBeenCalledWith(80, '127.0.0.1', expect.any(Function));
    expect(mockSocket.destroy).toHaveBeenCalled();
  });

  it('should return failure when telnet connection fails', async () => {
    const mockJob = {
      target: { ip: '192.168.1.999', port: 23 }
    };

    const resultPromise = telnetCheck(mockJob);

    const errorCallback = mockSocket.on.mock.calls[0][1];
    errorCallback(new Error('Connection refused'));

    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.message).toContain('Telnet bağlantısı başarısız → IP: 192.168.1.999, Port: 23');
    expect(result.message).toContain('Connection refused');
  });

  it('should handle timeout', async () => {
    const mockJob = {
      target: { ip: '192.168.1.100', port: 8080 }
    };

    jest.useFakeTimers();

    const resultPromise = telnetCheck(mockJob);

    jest.runAllTimers();

    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.message).toContain('Telnet bağlantısı zaman aşımına uğradı → IP: 192.168.1.100, Port: 8080');
    expect(mockSocket.destroy).toHaveBeenCalled();

    jest.useRealTimers();
  });
});