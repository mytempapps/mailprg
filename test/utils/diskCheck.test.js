const diskCheck = require('../../utils/diskCheck');
const fs = require('fs');
const { execSync } = require('child_process');

jest.mock('fs');
jest.mock('child_process');

describe('diskCheck', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return success when disk space is sufficient (Windows)', async () => {
    const mockJob = {
      target: { path: 'C:\\', min_free_gb: 10 }
    };

    Object.defineProperty(process, 'platform', { value: 'win32' });
    execSync.mockReturnValue('FreeSpace\n123456789012');

    const result = await diskCheck(mockJob);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Disk alanı yeterli');
    expect(result.message).toContain('114.9');
  });

  it('should return failure when disk space is insufficient (Windows)', async () => {
    const mockJob = {
      target: { path: 'C:\\', min_free_gb: 1000 }
    };

    Object.defineProperty(process, 'platform', { value: 'win32' });
    execSync.mockReturnValue('FreeSpace\n123456789012');

    const result = await diskCheck(mockJob);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Disk alanı yetersiz');
  });

  it('should return success when disk space is sufficient (Linux)', async () => {
    const mockJob = {
      target: { path: '/', min_free_gb: 5 }
    };

    Object.defineProperty(process, 'platform', { value: 'linux' });
    fs.statSync.mockReturnValue({ isDirectory: () => true });
    execSync.mockReturnValue('/dev/sda1              100G   50G   45G  53% /');

    const result = await diskCheck(mockJob);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Disk alanı yeterli');
    expect(result.message).toContain('45 GB boş');
  });

  it('should handle errors gracefully', async () => {
    const mockJob = {
      target: { path: '/invalid', min_free_gb: 10 }
    };

    fs.statSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    const result = await diskCheck(mockJob);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Disk kontrol hatası');
    expect(result.message).toContain('ENOENT: no such file or directory');
  });

  it('should handle invalid path', async () => {
    const mockJob = {
      target: { path: '/not/a/directory', min_free_gb: 10 }
    };

    Object.defineProperty(process, 'platform', { value: 'linux' });
    fs.statSync.mockReturnValue({ isDirectory: () => false });

    const result = await diskCheck(mockJob);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Geçersiz disk yolu');
  });
});