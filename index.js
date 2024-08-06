const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

class Car extends Model {}
Car.init({
  id: DataTypes.INTEGER,
  brand: DataTypes.STRING,
  model: DataTypes.STRING,
  year: DataTypes.INTEGER,
  mileage: DataTypes.INTEGER,
}, { sequelize, modelName: 'car' });

class Inspection extends Model {}
Inspection.init({
  id: DataTypes.INTEGER,
  carId: DataTypes.INTEGER,
  inspectionDate: DataTypes.DATE,
  inspectionTime: DataTypes.TIME,
  inspectionLocation: DataTypes.STRING,
})

class Criteria extends Model {}
Criteria.init({
  id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  parentId: DataTypes.INTEGER,
})

class CriteriaByInspection extends Model {}
CriteriaByInspection.init({
  id: DataTypes.INTEGER,
  inspectionId: DataTypes.INTEGER,
  criteriaId: DataTypes.INTEGER,
  result: DataTypes.STRING,
  notes: DataTypes.STRING,
})

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
