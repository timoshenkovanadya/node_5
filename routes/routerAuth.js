const express = require('express');
const authRouter = express.Router();
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "manager.json");
let users = require('../manager.json');
const bcrypt = require('bcryptjs');


authRouter.post("/register", async (req, res, next) => {
        let { email, password } = await req.body;               
        const newId = (Math.max(users.map((user) => user.id)) + 1) || 1;
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = {
          id: newId,
          email,
          password: hashedPassword,
          super: null
        };
       
        users.push(newUser);
        res.status(201).json(newUser);
        fs.writeFile(filePath, JSON.stringify(users), (err) => {
          if (err) throw err;
        });
      }
    );
  

module.exports = authRouter