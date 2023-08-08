const express = require( "express");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const multer = require("multer")

const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comment");
const likesRoutes = require("./routes/likes");
const postsRoutes = require("./routes/posts");
const relationshipRoutes = require("./routes/relationship");
const userRoutes = require("./routes/user");

const app = express();

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true);  // whenever we make a req, we give a access response headers . this allows us to send cookies 
    next();
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:3000"        // client url
}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../uploadedImages')
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

app.post('/api/upload',upload.single("file"),(req,res) => {
    const file = req.file;
    res.status(200).json({
        success : "true",
        message: "image uploaded successfull",
        // data :file.filename
    });
})


app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/users", userRoutes);

app.listen(8800, ()=>{
    console.log("Server listening to port 8800")
});
