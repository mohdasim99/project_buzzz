const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      fname: req.body.fname,
      lname: req.body.lname,
      gender: req.body.gender,
      profilePicture: req.body.profilePicture,
      coverPicture: req.body.coverPicture,
      desc: req.body.desc,
      designation: req.body.designation,
      phone: req.body.phone,
      DOB: req.body.DOB,
      city: req.body.city,
      from: req.body.from,
      zip: req.body.zip,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});


module.exports = router;