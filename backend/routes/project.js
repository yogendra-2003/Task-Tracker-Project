const express = require('express');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
});

router.post('/', async (req, res) => {
  const count = await Project.countDocuments({ userId: req.user.userId });
  if (count >= 4) return res.status(400).json({ message: "Limit reached" });
  const project = new Project({ name: req.body.name, userId: req.user.userId });
  await project.save();
  res.json(project);
});

router.get('/', async (req, res) => {
  const projects = await Project.find({ userId: req.user.userId });
  res.json(projects);
});

module.exports = router;
