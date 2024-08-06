const express = require('express');
const cors = require('cors');

const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  credentials: true, // Allow cookies to be sent
}));

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

class Car extends Model {}
Car.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // Automatically generate UUIDs
  },
  brand: DataTypes.STRING,
  model: DataTypes.STRING,
  year: DataTypes.INTEGER,
  mileage: DataTypes.INTEGER, // in km
}, { sequelize, modelName: 'car' });

class Inspection extends Model {}
Inspection.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // Automatically generate UUIDs
  },
  carId: DataTypes.UUID,
  inspectionDate: DataTypes.DATE,
  inspectionTime: DataTypes.TIME,
  inspectionLocation: DataTypes.STRING,
}, { sequelize, modelName: 'inspection' })

class Criteria extends Model {}
Criteria.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // Automatically generate UUIDs
  },
  name: DataTypes.STRING,
}, { sequelize, modelName: 'criteria' })

class CriteriaByInspection extends Model {}
CriteriaByInspection.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4 // Automatically generate UUIDs
  },
  inspectionId: DataTypes.UUID,
  criteriaId: DataTypes.UUID,
  result: DataTypes.STRING,
  notes: DataTypes.STRING,
}, { sequelize, modelName: 'criteria_by_inspection' })

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
app.use(express.json());

// CRUD routes for Car model
app.get('/cars', async (req, res) => {
  const cars = await Car.findAll();
  res.json(cars);})

app.get('/cars/:id', async (req, res) => {
  const car = await Car.findByPk(req.params.id);
  res.json(car);
});

app.post('/cars', async (req, res) => {
  const car = await Car.create(req.body);;
  res.json(car);
});

app.put('/cars/:id', async (req, res) => {
  const car = await Car.findByPk(req.params.id);
  if (car) {
    await car.update(req.body);
    res.json(car);
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

app.delete('/cars/:id', async (req, res) => {
  const car = await Car.findByPk(req.params.id);
  if (car) {
    await car.destroy();
    res.json({ message: 'Car deleted' });
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// CRUD routes for Inspection model
app.get('/inspections', async (req, res) => {
  const inspections = await Inspection.findAll();
  res.json(inspections);
});

app.get('/inspections/:id', async (req, res) => {
  const inspection = await Inspection.findByPk(req.params.id);
  res.json(inspection);
});

app.post('/inspections', async (req, res) => {
  const inspection = await Inspection.create(req.body);
  res.json(inspection);
});

app.put('/inspections/:id', async (req, res) => {
  const inspection = await Inspection.findByPk(req.params.id);
  if (inspection) {
    await inspection.update(req.body);
    res.json(inspection);
  } else {
    res.status(404).json({ message: 'Inspection not found' });
  }
});

app.delete('/inspections/:id', async (req, res) => {
  const inspection = await Inspection.findByPk(req.params.id);
  if (inspection) {
    await inspection.destroy();
    res.json({ message: 'Inspection deleted' });
  } else {
    res.status(404).json({ message: 'Inspection not found' });
  }
});

// CRUD routes for Criteria model
app.get('/criteria', async (req, res) => {
  const criteria = await Criteria.findAll();
  res.json(criteria);
});

app.get('/criteria/:id', async (req, res) => {
  const criteria = await Criteria.findByPk(req.params.id);
  res.json(criteria);
});

app.post('/criteria', async (req, res) => {
  const criteria = await Criteria.create(req.body);
  res.json(criteria);
});

app.post('/criteria/batch', async (req, res) => {
  const criteriaArray = req.body.criteriaArray;
  try {
    const createdCriteria = await Criteria.bulkCreate(criteriaArray);
    res.status(201).json(createdCriteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/criteria/:id', async (req, res) => {
  const criteria = await Criteria.findByPk(req.params.id);
  if (criteria) {
    await criteria.update(req.body);
    res.json(criteria);
  } else {
    res.status(404).json({ message: 'Criteria not found' });
  }
});

app.delete('/criteria/:id', async (req, res) => {
  const criteria = await Criteria.findByPk(req.params.id);
  if (criteria) {
    await criteria.destroy();
    res.json({ message: 'Criteria deleted' });
  } else {
    res.status(404).json({ message: 'Criteria not found' });
  }
});

// CRUD routes for CriteriaByInspection model
app.get('/criteria_by_inspection', async (req, res) => {
  const criteriaByInspection = await CriteriaByInspection.findAll();
  res.json(criteriaByInspection);
});

app.get('/criteria_by_inspection/:id', async (req, res) => {
  const criteriaByInspection = await CriteriaByInspection.findByPk(req.params.id);
  res.json(criteriaByInspection);
});

app.post('/criteria_by_inspection', async (req, res) => {
  const criteriaByInspection = await CriteriaByInspection.create(req.body);
  res.json(criteriaByInspection);
});

app.put('/criteria_by_inspection/:id', async (req, res) => {
  const criteriaByInspection = await CriteriaByInspection.findByPk(req.params.id);
  if (criteriaByInspection) {
    await criteriaByInspection.update(req.body);
    res.json(criteriaByInspection);
  } else {
    res.status(404).json({ message: 'CriteriaByInspection not found' });
  }
});

app.delete('/criteria_by_inspection/:id', async (req, res) => {
  const criteriaByInspection = await CriteriaByInspection.findByPk(req.params.id);
  if (criteriaByInspection) {
    await criteriaByInspection.destroy();
    res.json({ message: 'CriteriaByInspection deleted' });
  } else {
    res.status(404).json({ message: 'CriteriaByInspection not found' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
