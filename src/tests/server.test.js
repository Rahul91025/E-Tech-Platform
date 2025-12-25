// Ye server.test test hai jo server.test functionality test karta hai.
const mockSync = jest.fn();
jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../models', () => ({
  sequelize: { sync: mockSync },
  User: jest.fn(),
  TestSeries: jest.fn(),
  Subscription: jest.fn(),
  TestAttempt: jest.fn()
}));

jest.mock('../config');
jest.mock('../app');

describe('Server', () => {
  let originalEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('should sync sequelize and start the server', async () => {
    process.env.PORT = '3000';
    mockSync.mockResolvedValue();

    const app = require('../app');
    app.listen = jest.fn((port, callback) => callback && callback());
    global.console.log = jest.fn();
    global.console.error = jest.fn();

    // Import server to trigger the code
    require('../server');

    // Wait for the async operation
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockSync).toHaveBeenCalled();
    expect(app.listen).toHaveBeenCalledWith('3000', expect.any(Function));
    expect(global.console.log).toHaveBeenCalledWith('Database connected successfully');
    expect(global.console.log).toHaveBeenCalledWith('Server running on 3000');
  }, 10000);

  it('should handle sequelize sync failure', async () => {
    mockSync.mockRejectedValue(new Error('Sync failed'));

    const app = require('../app');
    app.listen = jest.fn((port, callback) => callback && callback());
    global.console.log = jest.fn();
    global.console.error = jest.fn();

    // Import server to trigger the code
    require('../server');

    // Wait for the async operation
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockSync).toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledWith('Database connection failed:', 'Sync failed');
  });

  it('should start server on default port if PORT not set', async () => {
    delete process.env.PORT;
    mockSync.mockResolvedValue();

    const app = require('../app');
    app.listen = jest.fn((port, callback) => callback && callback());
    global.console.log = jest.fn();
    global.console.error = jest.fn();

    // Import server to trigger the code
    require('../server');

    // Wait for the async operation
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockSync).toHaveBeenCalled();
    expect(app.listen).toHaveBeenCalledWith(undefined, expect.any(Function));
    expect(global.console.log).toHaveBeenCalledWith('Database connected successfully');
    expect(global.console.log).toHaveBeenCalledWith('Server running on undefined');
  });
});

