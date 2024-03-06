var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cors = require("cors");
require("dotenv").config();
var multer = require("multer"),
  bodyParser = require("body-parser"),
  path = require("path");
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB);
var fs = require("fs");
var product = require("./model/product.js");
var user = require("./model/user.js");


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
var dir = "./uploads";
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(/*res.end('Only images are allowed')*/ null, false);
    }
    callback(null, true);
  },
});
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: false,
  })
);

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, "shhhhh11111", function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: "User unauthorized!",
            status: false,
          });
        }
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: "Apis",
  });
});

/* login api */
app.post("/login", async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      const data = await user.find({ username: req.body.username });

      if (data.length > 0) {
        if (bcrypt.compareSync(data[0].password, req.body.password)) {
          checkUserAndGenerateToken(data[0], req, res);
        } else {
          res.status(400).json({
            errorMessage: "Username or password is incorrect!",
            status: false,
          });
        }
      } else {
        res.status(400).json({
          errorMessage: "Username or password is incorrect!",
          status: false,
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Add all Details Properly first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/* register api */
app.post("/register", async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      const data = await user.find({ username: req.body.username });
      console.log(data);
      if (data.length == 0) {
        let User = new user({
          username: req.body.username,
          password: req.body.password,
        });
        const userreturned = await User.save()
          .then(() => {
            res.status(200).json({
              status: true,
              title: "Registered Successfully.",
            });
          })
          .catch((err) => {
            res.status(400).json({
              errorMessage: err,
              status: false,
            });
          });
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false,
          });
        } else {
          res.status(200).json({
            status: true,
            title: "Registered Successfully.",
          });
        }
      } else {
        res.status(400).json({
          errorMessage: `UserName ${req.body.username} Already Exist!`,
          status: false,
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Add proper details first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!" + e,
      status: false,
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign(
    { user: data.username, id: data._id },
    "shhhhh11111",
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: "Login Successfully.",
          token: token,
          status: true,
        });
      }
    }
  );
}

/* Api to add Product */
app.post("/add-product", upload.any(), async (req, res) => {
  
  console.log(req.body)
  try {
    if (
      req.files &&
      req.files[0] &&
      req.files[1] &&
      req.body &&
      req.body.formDate &&
      req.body.formnumber &&
      req.body.sarparastname &&
      req.body.sarparastfathername &&
      req.body.sarparastvillage &&
      req.body.sarparastpost &&
      req.body.sarparasttehseel &&
      req.body.sarparastdistt &&
      req.body.sarparaststate &&
      req.body.sarparastaadharno &&
      req.body.studentname &&
      req.body.studentfathername &&
      req.body.studentdateofbirth &&
      req.body.studentvillage &&
      req.body.studentpost &&
      req.body.studenttehseel &&
      req.body.studentdistt &&
      req.body.studentstate &&
      req.body.studentaadharno &&
      req.body.studentname2 &&
      req.body.studentfathername2 &&
      req.body.studentdateofbirth2 &&
      req.body.studentvillage2 &&
      req.body.studentpost2 &&
      req.body.studenttehseel2 &&
      req.body.studentdistt2 &&
      req.body.studentstate2 &&
      req.body.studentaadharno2 &&
      req.body.shoba &&
      req.body.dateshamsi &&
      req.body.datekamari &&
      req.body.darjarequested &&
      req.body.darjagiven &&
      req.body.beforethis &&
      req.body.talibilmrishta &&
      req.body.sarparastmobileno &&
      req.body.sarparastwhatsappno
    ) {
      let new_product = await product.create({
        studentprofilepic: req.files[0].filename,
        sarparastprofilepic: req.files[1].filename,
        sarparastname: req.body.sarparastname,
        sarparastfathername: req.body.sarparastfathername,
        sarparastvillage: req.body.sarparastvillage,
        formDate: req.body.formDate,
        formnumber: req.body.formnumber,

        sarparastpost: req.body.sarparastpost,
        sarparasttehseel: req.body.sarparasttehseel,
        sarparastdistt: req.body.sarparastdistt,
        sarparaststate: req.body.sarparaststate,
        sarparastaadharno: req.body.sarparastaadharno,
        studentname: req.body.studentname,
        studentfathername: req.body.studentfathername,
        studentdateofbirth: req.body.studentdateofbirth,
        studentvillage: req.body.studentvillage,
        studentpost: req.body.studentpost,
        studenttehseel: req.body.studenttehseel,
        studentdistt: req.body.studentdistt,
        studentstate: req.body.studentstate,
        studentaadharno: req.body.studentaadharno,
        studentname2: req.body.studentname2,
        studentfathername2: req.body.studentfathername2,
        studentdateofbirth2: req.body.studentdateofbirth2,
        studentvillage2: req.body.studentvillage2,
        studentpost2: req.body.studentpost2,
        studenttehseel2: req.body.studenttehseel2,
        studentdistt2: req.body.studentdistt2,
        studentstate2: req.body.studentstate2,
        studentaadharno2: req.body.studentaadharno2,
        shoba: req.body.shoba,
        dateshamsi: req.body.dateshamsi,
        datekamari: req.body.datekamari,
        darjarequested: req.body.darjarequested,
        darjagiven: req.body.darjagiven,
        beforethis: req.body.beforethis,
        talibilmrishta: req.body.talibilmrishta,
        sarparastmobileno: req.body.sarparastmobileno,
        sarparastwhatsappno: req.body.sarparastwhatsappno,
        user_id: req.user.id,
      });

      await new_product
        .save()
        .then(() => {
          res.status(200).json({
            status: true,
            title: "Product Added successfully.",
          });
        })
        .catch((err) => {
          res.status(400).json({
            errorMessage: err,
            status: false,
          });
        });
    } else {
      res.status(400).json({
        errorMessage: "Add all details first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!" + e,
      status: false,
    });
  }
});

/* Api to update Product */
app.post("/update-product", upload.any(), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  try {
    if (
      req.files &&
      req.files[0] &&
      req.files[1] &&
      req.body &&
      req.body.id &&
      req.body.formDate &&
      req.body.formnumber &&
      req.body.sarparastname &&
      req.body.sarparastfathername &&
      req.body.sarparastvillage &&
      req.body.sarparastpost &&
      req.body.sarparasttehseel &&
      req.body.sarparastdistt &&
      req.body.sarparaststate &&
      req.body.sarparastaadharno &&
      req.body.studentname &&
      req.body.studentfathername &&
      req.body.studentdateofbirth &&
      req.body.studentvillage &&
      req.body.studentpost &&
      req.body.studenttehseel &&
      req.body.studentdistt &&
      req.body.studentstate &&
      req.body.studentaadharno &&
      req.body.studentname2 &&
      req.body.studentfathername2 &&
      req.body.studentdateofbirth2 &&
      req.body.studentvillage2 &&
      req.body.studentpost2 &&
      req.body.studenttehseel2 &&
      req.body.studentdistt2 &&
      req.body.studentstate2 &&
      req.body.studentaadharno2 &&
      req.body.shoba &&
      req.body.dateshamsi &&
      req.body.datekamari &&
      req.body.darjarequested &&
      req.body.darjagiven &&
      req.body.beforethis &&
      req.body.talibilmrishta &&
      req.body.sarparastmobileno &&
      req.body.sarparastwhatsappno
    ) {
      product.findById(req.body.id).then((new_product) => {
        if (
          req.files &&
          req.files[0] &&
          req.files[0].filename &&
          req.files[1] &&
          req.files[1].filename &&
          new_product.studentprofilepic &&
          new_product.sarparastprofilepic
        ) {
          var path = `./uploads/${new_product.studentprofilepic}`;
          fs.unlinkSync(path);
        }

        if (req.files && req.files[0] && req.files[0].filename) {
          new_product.studentprofilepic = req.files[0].filename;
        }
        if (req.files && req.files[1] && req.files[1].filename) {
          new_product.sarparastprofilepic = req.files[1].filename;
        }
        if (req.body.sarparastname) {
          new_product.sarparastname = req.body.sarparastname;
        }
        if (req.body.formDate) {
          new_product.formDate = req.body.formDate;
        }
        if (req.body.formnumber) {
          new_product.formnumber = req.body.formnumber;
        }
        if (req.body.sarparastfathername) {
          new_product.sarparastfathername = req.body.sarparastfathername;
        }
        if (req.body.sarparastvillage) {
          new_product.sarparastvillage = req.body.sarparastvillage;
        }
        if (req.body.sarparastpost) {
          new_product.sarparastpost = req.body.sarparastpost;
        }
        if (req.body.sarparasttehseel) {
          new_product.sarparasttehseel = req.body.sarparasttehseel;
        }
        if (req.body.sarparastdistt) {
          new_product.sarparastdistt = req.body.sarparastdistt;
        }
        if (req.body.sarparaststate) {
          new_product.sarparaststate = req.body.sarparaststate;
        }
        if (req.body.sarparastaadharno) {
          new_product.sarparastaadharno = req.body.sarparastaadharno;
        }

        if (req.body.studentname) {
          new_product.studentname = req.body.studentname;
        }
        if (req.body.studentfathername) {
          new_product.studentfathername = req.body.studentfathername;
        }
        if (req.body.studentdateofbirth) {
          new_product.studentdateofbirth = req.body.studentdateofbirth;
        }
        if (req.body.studentvillage) {
          new_product.studentvillage = req.body.studentvillage;
        }
        if (req.body.studentpost) {
          new_product.studentpost = req.body.studentpost;
        }
        if (req.body.studenttehseel) {
          new_product.studenttehseel = req.body.studenttehseel;
        }
        if (req.body.studentdistt) {
          new_product.studentdistt = req.body.studentdistt;
        }
        if (req.body.studentstate) {
          new_product.studentstate = req.body.studentstate;
        }
        if (req.body.studentaadharno) {
          new_product.studentaadharno = req.body.studentaadharno;
        }
        if (req.body.studentname2) {
          new_product.studentname2 = req.body.studentname2;
        }
        if (req.body.studentfathername2) {
          new_product.studentfathername2 = req.body.studentfathername2;
        }
        if (req.body.studentdateofbirth2) {
          new_product.studentdateofbirth2 = req.body.studentdateofbirth2;
        }
        if (req.body.studentvillage2) {
          new_product.studentvillage2 = req.body.studentvillage2;
        }
        if (req.body.studentpost2) {
          new_product.studentpost2 = req.body.studentpost2;
        }
        if (req.body.studenttehseel2) {
          new_product.studenttehseel2 = req.body.studenttehseel2;
        }
        if (req.body.studentdistt2) {
          new_product.studentdistt2 = req.body.studentdistt2;
        }
        if (req.body.studentstate2) {
          new_product.studentstate2 = req.body.studentstate2;
        }
        if (req.body.studentaadharno2) {
          new_product.studentaadharno2 = req.body.studentaadharno2;
        }
        if (req.body.shoba) {
          new_product.shoba = req.body.shoba;
        }
        if (req.body.dateshamsi) {
          new_product.dateshamsi = req.body.dateshamsi;
        }
        if (req.body.datekamari) {
          new_product.datekamari = req.body.datekamari;
        }
        if (req.body.darjarequested) {
          new_product.darjarequested = req.body.darjarequested;
        }
        if (req.body.darjagiven) {
          new_product.darjagiven = req.body.darjagiven;
        }
        if (req.body.beforethis) {
          new_product.beforethis = req.body.beforethis;
        }
        if (req.body.talibilmrishta) {
          new_product.talibilmrishta = req.body.talibilmrishta;
        }
        if (req.body.sarparastmobileno) {
          new_product.sarparastmobileno = req.body.sarparastmobileno;
        }
        if (req.body.sarparastwhatsappno) {
          new_product.sarparastwhatsappno = req.body.sarparastwhatsappno;
        }

        new_product
          .save()
          .then(() => {
            res.status(200).json({
              status: true,
              title: "Product updated.",
            });
          })
          .catch((err) => {
            res.status(400).json({
              errorMessage: err,
              status: false,
            });
          });
      });
    } else {
      res.status(400).json({
        errorMessage: "Add all details first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/* Api to delete Product */
app.post("/delete-product", (req, res) => {
  try {
    if (req.body && req.body.id) {
      product
        .findByIdAndDelete(req.body.id)
        .then(() => {
          res.status(200).json({
            status: true,
            title: "Product deleted.",
          });
        })
        .catch((err) => {
          res.status(400).json({
            errorMessage: "Not Able To Delete The Product " + err,
            status: false,
          });
        });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/*Api to get and search product with pagination and search by name*/
app.get("/get-product", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id,
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search },
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    product
      .find(query, {
        date: 1,
        id: 1,
        studentprofilepic: 1,
        sarparastprofilepic: 1,
        formDate: 1,
        formnumber: 1,
        sarparastname: 1,
        sarparastfathername: 1,
        sarparastvillage: 1,
        sarparastpost: 1,
        sarparasttehseel: 1,
        sarparastdistt: 1,
        sarparaststate: 1,
        sarparastaadharno: 1,
        studentname: 1,
        studentfathername: 1,
        studentdateofbirth: 1,
        studentvillage: 1,
        studentpost: 1,
        studenttehseel: 1,
        studentdistt: 1,
        studentstate: 1,
        studentaadharno: 1,
        studentname2: 1,
        studentfathername2: 1,
        studentdateofbirth2: 1,
        studentvillage2: 1,
        studentpost2: 1,
        studenttehseel2: 1,
        studentdistt2: 1,
        studentstate2: 1,
        studentaadharno2: 1,
        shoba:1,
dateshamsi:1,
datekamari:1,
darjarequested:1,
darjagiven:1,
beforethis:1,
talibilmrishta:1,
sarparastmobileno:1,
sarparastwhatsappno:1,
      })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .then((data) => {
        product
          .find(query)
          .count()
          .then((count) => {
            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: "Product retrived.",
                products: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: "There is no Student!",
                status: false,
              });
            }
          });
      })
      .catch((err) => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false,
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});
//api to get single product
app.get("/product/:id", async (req, res) => {
  console.log(req.params.id);
  await product
    .findById(req.params.id)
    .then((product) => {
      res.status(200).json({
        product: product,
      });
    })
    .catch((err) => {
      res.status(400).json({
        errorMessage: err.message || err,
        status: false,
      });
    });
});

app.listen(2000, (err) => {
  console.log("Server is Runing On port 2000");
  console.log(err);
});
