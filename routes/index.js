const { Router } = require('express');
const bodyParser = require('body-parser');
const connection = require('./conf');

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    title: 'fil_rouge'
  });
});

router.get('/api/films', (req, res) => {
  if (req.query.name) {
    const { name } = req.query;
    connection.query(`SELECT id, name, date from films where name='${name}'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.contains) {
    const { contains } = req.query;
    connection.query(`SELECT id, name from films where name like '%${contains}%'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.start) {
    const { start } = req.query;
    connection.query(`SELECT id, name from films where name like '${start}%'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.date) {
    const { date } = req.query;
    connection.query(`SELECT name from films where date> '${date}'`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else if (req.query.order) {
    const { order } = req.query;
    connection.query(`SELECT * from films ORDER BY date ${order}`, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else {
    connection.query('SELECT * from films', (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  }
});

router.post('/api/films', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO films SET ?', formData, () => {
    res.sendStatus(200);
  });
});

router.put('/api/films', (req, res) => {
  const idFilms = req.body.id;
  const formData = req.body;

  connection.query('UPDATE films SET ? WHERE id = ?', [formData, idFilms], (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la modification d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/api/films/sortie/:id', (req, res) => {
  const idFilms = req.params.id;
  const formData = req.body;
  // eslint-disable-next-line no-console
  console.log(idFilms);
  connection.query(`UPDATE films SET sortie = !sortie WHERE id = ${idFilms}`, formData, (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la modification d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/api/films/:id', (req, res) => {
  const idFilms = req.params.id;
  connection.query('DELETE FROM films WHERE id = ?', [idFilms], (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/api/films/sortie/0', (req, res) => {
  const bool = 0;
  connection.query('DELETE FROM films WHERE sortie = ?', [bool], (err) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression d'un film");
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
