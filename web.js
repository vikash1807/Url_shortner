const mongoose = require('mongoose');
const express = require('express');
const shortId = require('shortid');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var md5 = require('md5');


const app = express();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/urlsrt');

}

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}))
app.use(flash());




const srtUrlSchema = new mongoose.Schema({
    fullurl: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    
})


const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const SrtUrl = mongoose.model('SrtUrl', srtUrlSchema);
const User = mongoose.model("User", userSchema);


app.get('/search', async (req, res) => {
    res.render('search',{tr2:req.flash('tr2'),tr6:req.flash('tr6'),tr4:req.flash('tr4')});
})

app.get('/', async (req, res) => {
    res.render('login',{tr7:req.flash('tr7'),tr8:req.flash('tr8'),tr11:req.flash('tr11')});
})
app.get('/signup', async (req, res) => {
    res.render('signup')
})
app.get('/reset', async (req, res) => {
    res.render('reset',{tr9:req.flash('tr9'),tr10:req.flash('tr10')})
})

app.get('/create', async (req, res) => {
   
    const temp_url = await SrtUrl.find({ fullurl:req.flash('tr3')});

    // console.log(await SrtUrl.find({ fullurl:req.flash('tr3')}));
    res.render('index',{tr1: req.flash('tr1'), tr6:req.flash('tr6'), tr3:temp_url});
})

app.post('/create', async (req, res) => {
    const Url = req.body.cUrl;
    const Note = req.body.cNote;
    const url = await SrtUrl.find({ fullurl: Url });
    const note = await SrtUrl.find({ note: Note });

    // console.log(note);rs

    if (note.length > 0) {
        req.flash('tr6', "Note already exists")
        return res.redirect('/create');
    }

    if (url.length == 0) {
        const shortUrl = new SrtUrl({
            fullurl: Url,
            note: Note
        })
        // console.log(shortUrl);
        let temp = shortUrl.save();
        if (temp) {
            req.flash('tr1', "Url shortened")
            req.flash('tr3', Url)
        }

        res.redirect('/create');
    }
    else {
        // console.log("note already exists1212")
        req.flash('tr2', "Shortened url already present, search it via full url or note.")
        res.redirect('/search')

    }
})

app.post('/search', async (req, res) => {
    const Url1 = req.body.sUrl;
    let Note1 = req.body.sNote;
    let temp_url1;
    // console.log(FullUrl1,Note1);
    if (Url1 == "" && Note1 == "") {
        req.flash('tr6', "Fill out any one of the section to get results.");
        return res.redirect('/search');
    }
    if (Url1 != "") {
        temp_url1 = await SrtUrl.find({ fullurl: Url1 });
    }
    else if (Note1 != "") {
        temp_url1 = await SrtUrl.find({ note: Note1 });
    }

    // console.log(url1)

    if (temp_url1.length > 0) {
        req.flash('tr4', temp_url1);
        res.redirect('/search');
    }
    else {
        req.flash('tr5', "Short URL not exists, you can create short url here")
        res.redirect('/create')
    }

})

app.post('/signup' ,async (req, res) => {
    const newUser = new User({
        email : req.body.username1,
        password : md5(req.body.password1)
    })

    newUser.save();

    res.redirect('/create');
})

app.post('/login', async (req,res) => {
    const username = req.body.username2;
    const password = md5(req.body.password2);

    let user = await User.findOne({email : username});
    if(user){
        if(user.password===password){
            res.redirect('/create');
        }
        else{
            req.flash('tr7', "password not match");
            res.redirect('/')
        }
    }
    else{
        req.flash('tr8', "user not found, please register first");
        res.redirect('/')
    }
})

app.post('/reset', async (req, res) => {
    const username = req.body.username3;
    const password1 = md5(req.body.pass1);
    const password2 = md5(req.body.pass2);
    let user = await User.findOne({email : username});
    // console.log(md5(user.password));
    if(user){
        if(password1 === password2){
            await User.updateOne(    
                {email : username},
                {password : password1},
            )

            req.flash('tr11', "password changes successfully");
            res.redirect('/');
        }
        else{
            req.flash('tr10', "confirm password not match");
            res.redirect('/reset')
        }
    }
    else{
        req.flash('tr9', "user not found");
        res.redirect('/reset')
    }
})

app.get('/:shortUrl', async (req, res) => {
    const temp = await SrtUrl.findOne({ short: req.params.shortUrl });
    if (temp == null) return res.sendStatus(404);

    temp.save();
    res.redirect(temp.fullurl);
})



const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`server started on port ${port}`);
});






