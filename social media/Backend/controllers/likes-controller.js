const jwt = require("jsonwebtoken");
const db = require("../connect");

 const getLikes =async(req, res) => {

    const q ="SELECT userId FROM likes WHERE postId = ?";

    db.query(q, [req.params.postId], (err, data) => {
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
            data : data.map((like => like.userId))
        });
    });
};


const addLike = async (req,res)=>{
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

        const q = "INSERT INTO `likes` (`userId`, `postId`) VALUES (?)";

        const values = [ 
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
                message : "Post has been liked successfully",
                data : data
            });
        });
    })
}


const deleteLike = async (req,res)=>{
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

        const q = "DELETE FROM likes WHERE `userId`= ? AND `postId` = ?";

        db.query(q,[userInfo.id, req.params.postId,], (err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            return res.status(201).json({
                success : true,
                message : "like has been removed from this post successfully",
                data : data
            });
        });
    })
}

module.exports = {
    getLikes,
    addLike,
    deleteLike
}