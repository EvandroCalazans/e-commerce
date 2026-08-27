require('dotenv').config({
    path: require('path').join(__dirname, '../../.env')
});

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    console.log("================================");
    console.log("URL:", req.method, req.originalUrl);

    const token =
        req.headers.authorization?.split(" ")[1];

    if (!token) {

        console.log("SEM TOKEN");

        return res.status(401).json({
            mensagem: "Token não enviado"
        });
    }

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log(
            "TOKEN OK:",
            decoded.email
        );

        req.usuario = decoded;

        next();

    } catch (error) {

        console.log(
            "ERRO JWT:",
            error.message
        );

        return res.status(401).json({
            mensagem: "Token inválido"
        });
    }
};
