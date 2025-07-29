describe('sendMail', () => {
  it('should be a function', () => {
    const sendMail = require('../../mail/sendMail');
    expect(typeof sendMail).toBe('function');
  });

  it('should handle missing mail config gracefully', async () => {
    const sendMail = require('../../mail/sendMail');
    const jobWithoutMail = { id: 'test', type: 'ping' };
    
    const result = await sendMail(jobWithoutMail, 'test message');
    expect(result).toBeUndefined();
  });
});