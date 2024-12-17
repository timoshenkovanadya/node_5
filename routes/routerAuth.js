const express = require('express');
const authRouter = express.Router();
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "manager.json");
let users = require('../manager.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret-key1!'


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

    authRouter.post("/login", async (req, res, next) => {
      let { email, password } = await req.body;               
      const currentUser = users.find((user) => user.email === email);
      if(!currentUser) {
        return next({ status: 401, message: "No user with such email" });
      }      
      const passwordMatch = await bcrypt.compare(password, currentUser.password)
      if (!passwordMatch) {
        return next({ status: 401, message: "invalid password" });
      }
      const token = jwt.sign({ userId: currentUser.id }, SECRET_KEY, {
        expiresIn: '1h',
        });
      res.status(200).json({ token, email });
     
    }
  );

  

module.exports = authRouter