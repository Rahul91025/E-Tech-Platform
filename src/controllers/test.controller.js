// Ye test controller hai jo tests, test series aur cache management handle karta hai.
const testService = require("../services/test.service");
const CacheService = require("../services/cache.service");

// Ye function user ke tests ko list karta hai, cache se ya database se, pagination ke saath.
exports.getTests = async (req, res, next) => {
  try {
    const cacheKey = `tests:${req.user.id}:${req.query.page || 1}:${req.query.limit || 10}`;
    let data = await CacheService.get(cacheKey);
    if (!data) {
      data = await testService.listTests(req.query.page, req.query.limit, req.user);
      await CacheService.set(cacheKey, data, 1800); // Cache for 30 minutes
    }
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// Ye function ek naya test series create karta hai user ke liye aur cache ko clear karta hai.
exports.createTestSeries = async (req, res, next) => {
  try {
    const data = await testService.createTestSeries(req.body, req.user.id);

    await CacheService.del(`tests:${req.user.id}:*`);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

// Ye function ek specific test series ko fetch karta hai, cache se ya database se.
exports.getTestSeries = async (req, res, next) => {
  try {
    const cacheKey = `testSeries:${req.params.id}`;
    let data = await CacheService.get(cacheKey);
    if (!data) {
      data = await testService.getTestSeriesById(req.params.id, req.user);
      if (!data) return res.status(404).json({ message: "Test series not found" });
      await CacheService.set(cacheKey, data, 1800); // Cache for 30 minutes
    }
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// Ye function test series ko update karta hai user ke dwara.
exports.updateTestSeries = async (req, res, next) => {
  try {
    const data = await testService.updateTestSeries(req.params.id, req.body, req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// Ye function test series ko delete karta hai aur related cache ko clear karta hai.
exports.deleteTestSeries = async (req, res, next) => {
  try {
    await testService.deleteTestSeries(req.params.id, req.user.id);

    await CacheService.del(`testSeries:${req.params.id}`);
    await CacheService.del(`tests:${req.user.id}:*`);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

// Ye function test series ko approve karta hai admin ke dwara.
exports.approveTestSeries = async (req, res, next) => {
  try {
    const data = await testService.approveTestSeries(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// Ye function test ke liye questions ko fetch karta hai.
exports.getQuestions = async (req, res, next) => {
  try {
    const data = await testService.getQuestionsForTest(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};
