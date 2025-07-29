// Mock settings and logger before requiring sendMail
jest.mock('../../settings.json', () => ({
  mail: {
    from: 'test@example.com',
    to: 'test@example.com',
    smtp: {
      host: 'smtp.test.com',
      port: 587,
      secure: false,
      user: 'test@example.com',
      pass: 'testpass'
    }
  },
  logging: {
    enabled: false,
    level: 'info',
    log_to_console: false,
    log_to_file: false
  }
}));

jest.mock('../../logger', () => ({
  log: jest.fn()
}));

const sendMail = require('../../mail/sendMail');
const nodemailer = require('nodemailer');
const { log } = require('../../logger');

jest.mock('nodemailer');

const mockTransporter = {
  sendMail: jest.fn()
};

nodemailer.createTransport.mockReturnValue(mockTransporter);

describe('sendMail', () => {
  const mockJob = {
    id: 'test_job',
    system: 'TEST',
    target: { ip: '192.168.1.1', port: 80 },
    mail: {
      subject: 'Test Alert - {system}',
      body: 'Test message for {system} at {ip}:{port}'
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send email with formatted subject and body', async () => {
    mockTransporter.sendMail.mockResolvedValue({});

    await sendMail(mockJob, 'Test result message');

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Test Alert - TEST',
      text: expect.stringContaining('Test message for TEST at 192.168.1.1:80')
    });
    expect(log).toHaveBeenCalledWith('info', 'test_job', '📧 Mail gönderildi');
  });

  it('should handle email sending errors gracefully', async () => {
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

    await sendMail(mockJob, 'Test result message');

    expect(log).toHaveBeenCalledWith('error', 'test_job', 'Mail gönderme hatası: SMTP Error');
  });

  it('should not send email when mail config is missing', async () => {
    const jobWithoutMail = { ...mockJob };
    delete jobWithoutMail.mail;

    await sendMail(jobWithoutMail, 'Test result message');

    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });

  it('should format template variables correctly', async () => {
    mockTransporter.sendMail.mockResolvedValue({});

    const jobWithPath = {
      id: 'disk_job',
      system: 'DISK',
      target: { path: 'C:\\', min_free_gb: 10 },
      mail: {
        subject: 'Disk Alert - {system} - {path}',
        body: 'Disk {path} has {min_free_gb} GB minimum required'
      }
    };

    await sendMail(jobWithPath, 'Disk check result');

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Disk Alert - DISK - C:\\',
      text: expect.stringContaining('Disk C:\\ has 10 GB minimum required')
    });
  });
});