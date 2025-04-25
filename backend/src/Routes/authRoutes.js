import express from "express";

const router = express.Router();

router.get("/register", async (req, res) => {
  res.send("Register route");
});

router.post("/login", async (req, res) => {
    res.send("Login route");
});


export default router;