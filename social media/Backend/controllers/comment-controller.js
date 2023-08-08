const db = require("../connect");
const jwt = require("jsonwebtoken")
const moment = require ("moment")


const getComments = async(req,res)=>{
    const q = "SELECT c.* , u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u on (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC";

    db.query(q,[req.params.postId], (err,data)=>{
        if(err){
            return res.status(500).json({
                success : "false",
                message : "something went wrong",
                error : err
            });
        }

        return res.status(200).json({
            success : true,
            message : "comments fetched successfully",
            data : data
        });
    });
};


const addComment  = async(req,res)=>{
    const token = req.cookies.accessToken;
    if(!token){
        return res.status(401).json({
            success : "false",
            message : "User not logged in",
        });
    }
    jwt.verify(token, "secretKey@12345!!", (err,userInfo)=>{
        if(err){
            return res.status(403).json({
                success : "false",
                message : "token expired",
            });
        }

        const q = "INSERT INTO `comments` (`description`,`createdAt`, `userId`, `postId`) VALUES (?)";

        const values = [
            req.body.description,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId,
        ];

        db.query(q,[values], (err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            return res.status(201).json({
                success : true,
                message : "Comment created successfully",
                data : data
            });
        });
    })
}



module.exports = {
    getComments,
    addComment
}