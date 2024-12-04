const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Skill = require('../models/skillmodel');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Skills App' });
});

/* GET Login */
router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});
router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Registrate' });
});

/*SKILLS*/
router.get('/skill/add', (req, res) => {
  res.render('add-skill', { title: 'New Skill' });
});

router.get('/skills', async (req, res) => {
  try{
    let skills = await Skill.find();

    skills.forEach(skill => {
      if (typeof skill.textLines === 'string') {
        skill.textLines = [skill.textLines]; // Convierte a arreglo si es una cadena
      }
    });
    res.render('skills', {skills});
  }catch(err){
    console.error("Error al obtener las habilidades:", err);
    res.status(500).send("Error del servidor");
  }
});

router.get('/skills/:id', async (req, res) => {
  const skillId = req.params.id;
  try{
    const skill = await Skill.findById( skillId );
    if (skill) {
      res.render('detail', { skill });
    } else {
      res.status(404).send('Skill no encontrado');
    }
  }catch{
    console.error("Error al obtener la habilidad:", err);
    res.status(500).send("Error del servidor");
  } 
});

router.get('/skills/:id/edit', async (req, res) => {
  const skillId = req.params.id;
  try{
    const skill = await Skill.findById( skillId );
    if (skill) {
      res.render('edit-skill', { skill });
    } else {
      res.status(404).send('Skill no encontrado');
    }
  }catch{
    console.error("Error al obtener la habilidad para edición:", err);
    res.status(500).send("Error del servidor");
  }
});

router.post('/skill/add', async (req, res) => {
  const { text, icon, description, tasks, score, resources } = req.body;

  try {
    const newSkill = new Skill({ 
      text, 
      icon, 
      description, 
      tasks, 
      score, 
      skillTree: 'Electronics', 
      resources:['No hay recursos'] });
    await newSkill.save();
    
    res.status(201).json({ message: 'Skill creada exitosamente' });
    res.redirect('/skills');
  } catch (err) {
    console.error("Error al agregar la habilidad:", err);
    res.status(500).send("Error del servidor");
  }
});



/*LEADERBOARD*/

router.get('/leaderboard', (req, res) => {
  const badgesPath = path.join(__dirname, '../badges.json');
  const badges = JSON.parse(fs.readFileSync(badgesPath, 'utf8'));
  res.render('leaderboard', { badges });
});

router.get('/leaderboard/:rango', (req, res) => {
  const rango = req.params.rango;
  const badgesPath = path.join(__dirname, '../badges.json');

  const badges = JSON.parse(fs.readFileSync(badgesPath, 'utf8'));
  const badge = badges.find(b => b.rango === rango);

  if (badge) {
    res.render('edit-badge', { badge });
  } else {
    res.status(404).send('Medalla no encontrada');
  }
});

/*ABOUT US*/
router.get('/aboutus', (req, res) => {
  const badgesPath = path.join(__dirname, '../badges.json');
  const badges = JSON.parse(fs.readFileSync(badgesPath, 'utf8'));
  res.render('aboutus', { badges });
});

module.exports = router;
