const express = require('express');

const cors = require('cors');

const monk = require('monk');

const Filter = require('bad-words');

const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/donkeycall');
const donkeys = db.get('donkeys');

const filter = new Filter();

app.use(cors());

app.use(express.json());

const limiter = rateLimit({
  windowMs:30 * 1000, // 10 second....
  max: 1 // limit each IP to 1 requests per windowMs
});


app.get('/',(req,res)=>{
  res.json({
    message:'hello donkey is here'
  })
})

app.get('/donkeys',(req,res)=>{
  donkeys.find().then(value=>{
    res.json(value);
  })
})

function isValidMesssage(mew) {
  return (mew.name && mew.name.toString().trim()!=='') && (mew.content && mew.content.toString().trim()!=='');
}

app.use(limiter);

app.post('/donkeys',(req,res)=>{
  if (isValidMesssage(req.body)) {
    const mew ={
      name:filter.clean(req.body.name.toString()),
      content:filter.clean(req.body.content.toString()),
      create: new Date()
    }
    console.log(mew);
    donkeys.insert(mew).then(created=>{
      res.json(created);
    })
  } else {
    res.status(422)
    res.json({
      message:"hey! name and content are required."
    })
  }
})

app.listen(5000,()=>{
  console.log('listening on http://localhost:5000');
})
