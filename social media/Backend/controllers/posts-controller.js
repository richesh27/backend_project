const jwt = require("jsonwebtoken");
const db = require("../connect");
const moment = require ("moment")


const getPosts = async(req,res)=>{

    const userId = req.query.userId;
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

        // below query has two parts ... 1.) if we are on profile page     2.) if we are on our timeline

        const q = userId !== "undefined"
        ? "SELECT p.*, u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC" 
        : "SELECT p.*, u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC";

        const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

        db.query(q, values, (err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            return res.status(200).json({
                success : true,
                message : "Posts fetched successfully",
                data : data
            });
        });
    })
    
};


const addPost  = async(req,res)=>{
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

        const q = "INSERT INTO `posts` (`description`,`img`, `userId`, `createdAt`) VALUES (?)";

        const values = [
            req.body.description,
            req.body.img,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
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
                message : "Post created successfully",
                data : data
            });
        });
    })
}


const deletePost = (req, res) => {
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
  
        const q = "DELETE FROM posts WHERE id = ? AND `userId` = ?";
  
        db.query(q, [req.params.postId,userInfo.id], (err, data) => {
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            if(data.affectedRows > 0){
                return res.status(200).json({
                    success : true,
                    message : "post deleted successfully",
                });
            }
            return res.status(403).json("you can delete only your post")
        });
    });
};


module.exports = {
    getPosts,
    addPost,
    deletePost
}