//Imports
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const bcryot     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const middleware = require('./middleware/CheckToken')
//Models
const User = require("./models/User");

const app = express();
app.use(express.json());

//Private Router
app.get('/user/:id', middleware, async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg: 'usuário não encontrado!'})
    }
    
    try {
        //check if user exist
        const user = await User.findById(id, '-password');

        if (!user) {
            return res.status(404).json({ msg: 'usuário não encontrado!' });
        };

        res.status(200).json({ user });

    } catch (error) {
        console.error(error)
    };

})

app.get('/', async (req, res) => {
    const user = await User.find({}, '-password');

    if(!user){
        return res.status(404).json({msg: 'nenhum usuario!'});
    }

    res.status(200).json({user})
});


//Resgister user
app.post('/auth/register', async (req, res) => {

    const {email, password, name, confirmpassword} = req.body;

    //validações
    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatorio!'});
    }

    if(!email){
        return res.status(422).json({msg: 'O email é obrigatorio!'});
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatoria!'});
    }

    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As duas senhas não conferem'});
    }
    //check if user exist
    const userExists = await User.findOne({email:email});

    if(userExists){
        return res.status(422).json({msg: 'Por favor utilize outro email!'});
    };

    //create password
    const salt = await bcryot.genSalt(12);
    const passwordHash = await bcryot.hash(password, salt);

    //create user
    const user = new User({
        name, 
        email,
        password: passwordHash
    });

    try {

        await user.save()
        res.status(201).json({msg: 'Usuario criado com sucesso!'});

    } catch (error) {
        //Nunca retorne o erro do servido, mas como é apenas estudos...
        console.error(error)
        res.status(500).json({msg: 'Aconteceu algo, tente novamente mais tarde!'})
    };

});


//Login User

app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;

    //validações
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatorio!'});
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatoria!'});
    }
   
     //check if user exist
     const user = await User.findOne({email:email});

     if(!user){
         return res.status(404).json({msg: 'Usuario não encontrato!'});
     };

     //check if password math
     const checkPassword = await bcryot.compare(password, user.password);

     if(!checkPassword){
        return res.status(422).json({msg: 'Senha está errada!'});
     }
     try {

        const secret = process.env.SECRET;

        const token = jwt.sign({
            id:user._id
        }, secret);

        res.status(200).json({msg: 'Autenticação realizado com sucesso!', token})

    } catch (error) {
        //Nunca retorne o erro do servido, mas como é apenas estudos...
        console.error(error)
        res.status(500).json({msg: 'Aconteceu algo, tente novamente mais tarde!'})
    };
})

const password = process.env.DB_PASSWORD
const database = process.env.DB_USER;

const uri = `mongodb+srv://${database}:${password}@cluster0.xtevich.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
.then(() => {
    console.log('Conectou ao banco!')
    app.listen(4004, () => console.log('http://localhost:4004'))
    
}).catch((error) =>console.log(error))

