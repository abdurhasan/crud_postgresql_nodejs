const express = require('express');
const router = express.Router();
const helpers = require('../helpers/util')
/* GET home page. */



module.exports = (pool) => {

  // =========================== BROWSE  
  router.get('/', function (req, res, next) {
    const url = req.query.page ? req.url : '/?page=1';
    const page = req.query.page || 1;
    const limit = 3;
    let offset = (page - 1) * limit
    let searching = false;
    let params = [];

    if(req.query.cid && req.query.id){
      params.push(`id = ${req.query.id}`);
      searching = true;
    }

    if(req.query.cnama && req.query.nama){
      params.push(`nama = '${req.query.nama}'`);
      searching = true;
    }

    if(req.query.cumur && req.query.umur){
      params.push(`umur = ${req.query.umur}`);
      searching = true;
    }

    if(req.query.ctinggi && req.query.tinggi){
      params.push(`tinggi = ${req.query.tinggi}`);
      searching = true;
    }

    if(req.query.clahir && req.query.startlahir && req.query.endlahir){
      params.push(`lahir between '${req.query.startlahir}' AND '${req.query.endlahir}'`);
      searching = true;
    }

    if(req.query.cstatus && req.query.status){
      params.push(`status = ${req.query.status}`);
      searching = true;
    }

    let sql = `SELECT COUNT(*) as total from data`
    if(searching){
      sql += ` where ${params.join(' AND ')}`
    }
    

    pool.query(sql, (err, data) => {
      if (err) res.send(err)
      let total = data.rows[0].total;
      let pages = Math.ceil(total / limit)

      sql = 'SELECT * FROM data'
      if(searching){
        sql += ` where ${params.join(' AND ')}`
      }
      sql += ' LIMIT $1 OFFSET $2'
      console.log(sql)
      pool.query(sql, [limit, offset], (err, data) => {

        if (err) res.send(err)
        res.render('home', {
          title: 'App 21',
          data: data.rows,
          helpers,
          pagination: { limit, offset, pages, page, total, url },
          query: req.query
        });
      })
    })

  });

  router.get('/add', (req, res) => {

    res.render('add', { title: 'Tambah data' })
  })

  router.post('/add', (req, res) => {

    const sql = 'INSERT INTO data (nama,umur,tinggi,lahir,status) VALUES ($1,$2,$3,$4,$5)'
    const values = [req.body.nama, parseInt(req.body.umur), parseFloat(req.body.tinggi), req.body.lahir, JSON.parse(req.body.status)]
    pool.query(sql, values, (err, data) => {
      if (err) res.send(err)
      res.redirect('/');
    })
  })


  router.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM data WHERE id = $1'
    const values = [parseInt(req.params.id)]

    pool.query(sql, values, (err, data) => {
      if (err) res.send(err)
      res.redirect('/');
    })
  })
  router.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM data WHERE id = $1'
    const values = [parseInt(req.params.id)]

    pool.query(sql, values, (err, data) => {
      if (err) res.send(err)
      res.render('edit', { title: 'EDIT DATA', item: data.rows[0], helpers });
    })
  })

  router.post('/edit/:id', (req, res) => {
    const sql = 'UPDATE data SET nama=$1, umur=$2, tinggi=$3, lahir=$4, status=$5 WHERE id = $6'
    const values = [req.body.nama, parseInt(req.body.umur), parseFloat(req.body.tinggi), req.body.lahir, JSON.parse(req.body.status), parseInt(req.params.id)]
    console.log(req.body.lahir)

    pool.query(sql, values, (err, data) => {
      if (err) res.send(err)
      res.redirect('/');
    })
  })



  return router
}

