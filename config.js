const config = {
    dbUrl: "mongodb://localhost:27017/QuizDB",
    secretKey: "12345-12345",
    facebook: {
        appId: "389434655167734",
        facebookSecret: "c238d23ec852098278f177524faced50"
    },
    google:{
        type:"oauth2",
        user:"ars3753669@gmail.com",
        clientId:"741480805956-lblhpiv5tmcjsjrj004hjtbum1ensr2k.apps.googleusercontent.com",
        clientSecret:"TN8-IHTzVuxba4O1fFfqaj3R",
        refreshToken:"1/uv2KV0kkmIrCEhv6uV4K_bs1C9b2ufdbhKfXKfVB8RkehPWTWfEmtOEI4zroSQmm"
    }
}
module.exports = config;