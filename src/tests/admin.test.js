// Ye admin.test test hai jo admin.test functionality test karta hai.
const request = require('supertest');
const app = require('../app');
const { User, TestSeries, Subscription } = require('../models');
const jwt = require('jsonwebtoken');
const adminService = require('../services/admin.service');

jest.mock('../models');
jest.mock('../services/admin.service');

describe('Admin API Tests', () => {
  let adminToken;
  let teacherToken;
  let adminUser;
  let teacherUser;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'test';

    // Mock admin user
    adminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      isActive: true,
      isApproved: true
    };

    // Mock teacher user
    teacherUser = {
      id: 2,
      name: 'Teacher User',
      email: 'teacher@example.com',
      role: 'TEACHER',
      isActive: true,
      isApproved: false
    };

    // Generate tokens
    adminToken = jwt.sign({ id: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET || 'test-secret');
    teacherToken = jwt.sign({ id: teacherUser.id, role: teacherUser.role }, process.env.JWT_SECRET || 'test-secret');

    // Mock User methods
    User.findByPk = jest.fn();
    User.count = jest.fn();
    User.findAndCountAll = jest.fn();

    // Mock TestSeries methods
    TestSeries.findByPk = jest.fn();
    TestSeries.count = jest.fn();
    TestSeries.findAndCountAll = jest.fn();

    // Mock Subscription methods
    Subscription.findAll = jest.fn();

    // Mock adminService methods
    adminService.getDashboardStats = jest.fn();
    adminService.getAllUsers = jest.fn();
    adminService.approveTeacher = jest.fn();
    adminService.getAllTestSeries = jest.fn();
    adminService.approveTestSeries = jest.fn();
    adminService.getAnalytics = jest.fn();
    adminService.getRevenue = jest.fn();
  });

  describe('GET /api/v1/admin/dashboard', () => {
    it('should return dashboard stats for admin', async () => {
      const mockStats = {
        totalUsers: 100,
        totalTeachers: 5,
        approvedTeachers: 3,
        totalTestSeries: 30,
        approvedTestSeries: 20,
        totalSubscriptions: 50
      };
      adminService.getDashboardStats.mockResolvedValue(mockStats);

      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers', 100);
      expect(response.body).toHaveProperty('totalTeachers', 5);
      expect(response.body).toHaveProperty('approvedTeachers', 3);
      expect(response.body).toHaveProperty('totalTestSeries', 30);
      expect(response.body).toHaveProperty('approvedTestSeries', 20);
      expect(response.body).toHaveProperty('totalSubscriptions', 50);
    });

    it('should deny access to non-admin', async () => {
      const response = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return paginated users for admin', async () => {
      const mockData = {
        users: [
          { id: 1, name: 'User 1', email: 'user1@example.com', role: 'STUDENT' },
          { id: 2, name: 'User 2', email: 'user2@example.com', role: 'TEACHER' }
        ],
        pagination: { page: 1, limit: 10, total: 2 }
      };
      adminService.getAllUsers.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/v1/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.users).toHaveLength(2);
    });
  });

  describe('PUT /api/v1/admin/approve-teacher/:id', () => {
    it('should approve teacher successfully', async () => {
      const mockTeacher = { ...teacherUser };
      adminService.approveTeacher.mockResolvedValue(mockTeacher);

      const response = await request(app)
        .put('/api/v1/admin/approve-teacher/2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Teacher approved');
      expect(response.body).toHaveProperty('teacher');
    });

    it('should prevent admin from approving themselves', async () => {
      adminService.approveTeacher.mockRejectedValue(new Error('Cannot approve yourself'));

      const response = await request(app)
        .put('/api/v1/admin/approve-teacher/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500); // Since it's throwing an error, it will be caught by error middleware
    });

    it('should return error for non-existent teacher', async () => {
      adminService.approveTeacher.mockRejectedValue(new Error('Teacher not found'));

      const response = await request(app)
        .put('/api/v1/admin/approve-teacher/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/admin/test-series', () => {
    it('should return paginated test series for admin', async () => {
      const mockData = {
        testSeries: [
          { id: 1, title: 'Test 1', description: 'Desc 1', teacher: { name: 'Teacher 1', email: 't1@example.com' } },
          { id: 2, title: 'Test 2', description: 'Desc 2', teacher: { name: 'Teacher 2', email: 't2@example.com' } }
        ],
        pagination: { page: 1, limit: 10, total: 2 }
      };
      adminService.getAllTestSeries.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/v1/admin/test-series?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('testSeries');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.testSeries).toHaveLength(2);
    });
  });

  describe('PUT /api/v1/admin/approve-test/:id', () => {
    it('should approve test series successfully', async () => {
      const mockTest = { id: 1, title: 'Test 1', isApproved: true };
      adminService.approveTestSeries.mockResolvedValue(mockTest);

      const response = await request(app)
        .put('/api/v1/admin/approve-test/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Test series approved');
      expect(response.body).toHaveProperty('test');
    });

    it('should return error for non-existent test series', async () => {
      adminService.approveTestSeries.mockRejectedValue(new Error('Test series not found'));

      const response = await request(app)
        .put('/api/v1/admin/approve-test/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/v1/admin/analytics', () => {
    it('should return analytics data for admin', async () => {
      const mockAnalytics = {
        totalUsers: 100,
        activeUsers: 80,
        totalTestAttempts: 150,
        totalRevenue: 5000,
        newUsersLastMonth: 25
      };
      adminService.getAnalytics.mockResolvedValue(mockAnalytics);

      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers', 100);
      expect(response.body).toHaveProperty('activeUsers', 80);
      expect(response.body).toHaveProperty('totalTestAttempts', 150);
      expect(response.body).toHaveProperty('totalRevenue', 5000);
      expect(response.body).toHaveProperty('newUsersLastMonth', 25);
    });
  });

  describe('GET /api/v1/admin/revenue', () => {
    it('should return revenue data for admin', async () => {
      const mockRevenue = 29.98;
      adminService.getRevenue.mockResolvedValue(mockRevenue);

      const response = await request(app)
        .get('/api/v1/admin/revenue')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue', 29.98);
    });
  });
});

