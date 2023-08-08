const express  = require ("express");
const mysql = require("mysql2");


const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "adminrichesh@123",
    database : "sql_crud_practice"
});

app.get("/book", (req,res)=>{
    res.status(200).json({
        success : "true",
        message : "welcome to homepage backend",

    })
});

app.get("/books", (req,res)=>{
    // authenticate(req.header("Authorization"));
    const q = "select * from book";
    db.query(q, (err,dataa)=>{
        if(err){
            res.json({
                success : "false",
                message : " something went wrong",
                Error : err
            });
        }

        res.json({
            success : "true",
            message : " successfully fetched all books",
            data : dataa
        });
    })
})


app.post("/books", (req,res)=>{
    const q = "INSERT INTO `book` ( `title`, `description`, `cover`) VALUES (?)";
    const values = [req.body.title, req.body.description, req.body.cover, req.body.price]

    db.query(q,[values], (err,data)=>{
        if(err){
            res.json({
                success : "false",
                message : " something went wrong",
                Error : err
            });
        }

        res.json({
            success : "true",
            message : " successfully created book",
            data : data
        });
    })
});


app.delete("/book/:id", (req,res)=>{
    const bookid = req.params.id;
    const q = "DELETE FROM book WHERE id = ?";

    db.query(q,[bookid], (err,data)=>{
        if(err){
            res.json({
                success : "false",
                message : " something went wrong",
                Error : err
            });
        }

        res.json({
            success : "true",
            message : " successfully deleted book",
            data : data
        });
    })
});


app.put("/book/:id", (req,res)=>{
    const bookid = req.params.id;
    const values = [req.body.title, req.body.description, req.body.cover, req.body.price]
    const q = "UPDATE book SET `title` = ?, `description` = ?, `cover` = ?, `price` = ? WHERE id = ?";

    db.query(q,[...values, bookid], (err,data)=>{
        if(err){
            res.json({
                success : "false",
                message : " something went wrong",
                Error : err
            });
        }

        res.json({
            success : "true",
            message : " successfully updated the book",
            data : data
        });
    })

})

app.listen(5000, async() =>{
    console.log("server listening to port 5000");
})
