const express = require("express");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "top250.json");
const {
  checkId,
  checkNumber,
  checkRating,
  checkString,
  checkYear,
} = require("../helpers");

const filmsRouter = express.Router();

filmsRouter.get("/readall", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }
    res.send(data);
  });
});

filmsRouter.get("/read", (req, res, next) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return next(new Error("Error of file riding"));
    }
    const { body } = req;
    if (!checkId(body.id)) {
      return next({ status: 400, message: "id should be number or string" });
    }
    const arrData = JSON.parse(data);
    const curFilm = arrData.find((element) => element.id == body.id);
    if (curFilm) {
      res.send(curFilm);
    } else {
      return next({ status: 404, message: "No film with such id" });
    }
  });
});

filmsRouter.post("/create", (req, res, next) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return next(new Error("Error of file riding"));
    }
    let { title, rating, year, budget, gross, poster, position } = req.body;
    if (
      !title ||
      !checkString(title) ||
      !rating ||
      !checkRating(rating) ||
      !year ||
      !checkYear(year) ||
      !budget ||
      !checkNumber(budget) ||
      !gross ||
      !checkNumber(gross) ||
      !poster ||
      !checkString(poster) ||
      !position ||
      !checkNumber(position)
    ) {
      return next({
        status: 400,
        message: "Input data is empty or has invalid value",
      });
    } else {
      const films = JSON.parse(data);
      if (position > films.length) {
        position = films.length + 1;
      }
      const newId = Math.max(...films.map((film) => film.id)) + 1;
      const newFilm = {
        id: newId,
        title,
        rating,
        year,
        budget,
        gross,
        poster,
        position,
      };
      films.forEach((film) => {
        if (film.position >= position) {
          film.position += 1;
        }
      });
      films.push(newFilm);
      films.sort((a, b) => a.position - b.position);
      res.status(201).json(newFilm);
      fs.writeFile(filePath, JSON.stringify(films), (err) => {
        if (err) throw err;
      });
    }
  });
});

filmsRouter.post("/update", (req, res, next) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return next(new Error("Error of file riding"));
    }
    let { id, title, rating, year, budget, gross, poster, position } = req.body;
    if (
      (title && !checkString(title)) ||
      (rating && !checkRating(rating)) ||
      (year && !checkYear(year)) ||
      (budget && !checkNumber(budget)) ||
      (gross && !checkNumber(gross)) ||
      (poster && !checkString(poster)) ||
      (position && !checkNumber(position))
    ) {
      return next({
        status: 400,
        message: "Invalid input value",
      });
    } else {
      const films = JSON.parse(data);
      const currentElement = films.find((element) => element.id === id);
      const currentPosition = currentElement.position;
      if (position > films.length) {
        films.forEach((film) => {
          if (film.position > currentPosition) {
            film.position -= 1;
          }
        });
        position = films.length;
      }

      films.forEach((film) => {
        if (film.position === position) {
          film.position = currentPosition;
        }
      });
      const updatedFilms = films.map((item) =>
        item.id != id
          ? item
          : {
              id: item.id,
              title: title || item.title,
              rating: rating || item.rating,
              year: year || item.year,
              budget: budget || item.budget,
              gross: gross || item.gross,
              poster: poster || item.poster,
              position: position || item.position,
            }
      );
      const updatedFilm = updatedFilms.find((element) => element.id == id);
      updatedFilms.sort((a, b) => a.position - b.position);
      res.status(201).json(updatedFilm);
      fs.writeFile(filePath, JSON.stringify(updatedFilms), (err) => {
        if (err) throw err;
      });
    }
  });
});

filmsRouter.post("/delete", (req, res, next) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return next(new Error("Error of file riding"));
    }
    const { body } = req;
    if (!checkId(body.id)) {
      return next({ status: 400, message: "id should be number or string" });
    }
    let films = JSON.parse(data);
    const curFilm = films.find((element) => element.id == body.id);
    const curIndex = films.indexOf(curFilm);

    if (curFilm) {
      films.forEach((film) => {
        if (film.position > curFilm.position) {
          film.position -= 1;
        }
      });
      films.splice(curIndex, 1);
      res.status(200).json(`Film with id=${body.id} deleted`);
      fs.writeFile(filePath, JSON.stringify(films), (err) => {
        if (err) throw err;
      });
    } else {
      return next({ status: 404, message: "No film with such id" });
    }
  });
});

module.exports = filmsRouter;
