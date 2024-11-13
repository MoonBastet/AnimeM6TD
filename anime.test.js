const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('./index');  

describe('Pruebas de la API de Animes', function () {

  // El servidor responde con un código 200 al acceder a /animes
  it('Debe devolver todos los animes', function (done) {
    request(app)
      .get('/animes')
      .expect(200)  
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');  
        done();
      });
  });

  // Comprobar que se puede obtener un anime por su ID
  it('Debe devolver un anime por su ID', function (done) {
    request(app)
      .get('/animes/1')  
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('nombre').that.equals('Akira'); 
        done();
      });
  });

  // Probar la creación de un nuevo anime (POST)
  it('Debe crear un nuevo anime', function (done) {
    const newAnime = {
      id: '6',
      nombre: 'One Punch Man',
      genero: 'Shonen',
      año: '2015',
      autor: 'ONE'
    };

    request(app)
      .post('/animes')
      .send(newAnime)  
      .expect(201) 
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('id').that.equals('6');
        expect(res.body).to.have.property('nombre').that.equals('One Punch Man');
        done();
      });
  });

  // Probar la actualización de un anime (PUT)
  it('Debe actualizar un anime existente', function (done) {
    const updatedAnime = {
      nombre: 'One Punch Man (actualizado)',
      genero: 'Seinen',
      año: '2015',
      autor: 'ONE'
    };

    request(app)
      .put('/animes/6')  
      .send(updatedAnime)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('nombre').that.equals('One Punch Man (actualizado)');
        done();
      });
  });

  // Probar la eliminación de un anime (DELETE)
  it('Debe eliminar un anime por su ID', function (done) {
    request(app)
      .delete('/animes/6') 
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property('message').that.equals('Anime eliminado');
        done();
      });
  });

});
