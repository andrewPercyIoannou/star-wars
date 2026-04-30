import express from "express";
import axios from "axios";
import path from "path";




const app = express();
const port = process.env.PORT || 6969;
const swApi = "https://swapi.info/api/"
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req,res) =>{
    res.render("home.ejs")
})

app.get("/fight", async (req, res) => {
  const request = await axios.get(`${swApi}people`);
  const data = request.data;

  const fighters = [];
  while (fighters.length < 8) {
    const pick = Math.floor(Math.random() * data.length);
    if (!fighters.includes(data[pick])) fighters.push(data[pick]);
  }

  const round1 = [
    [fighters[0], fighters[1]],
    [fighters[2], fighters[3]],
    [fighters[4], fighters[5]],
    [fighters[6], fighters[7]],
  ];

  res.render("fights.ejs", { round1, semiFinals: null, final: null, champion: null });
});

app.post("/semi-finals", (req, res) => {
  const round1 = JSON.parse(req.body.round1);
  const getScore = (f) => Number(f.mass) + Number(f.height);

  const round1Winners = round1.map(([f1, f2]) => getScore(f1) > getScore(f2) ? f1 : f2);
  const semiFinals = [
    [round1Winners[0], round1Winners[1]],
    [round1Winners[2], round1Winners[3]],
  ];

  res.render("fights.ejs", { round1, semiFinals, final: null, champion: null });
});

app.post("/final", (req, res) => {
  const round1 = JSON.parse(req.body.round1);
  const semiFinals = JSON.parse(req.body.semiFinals);
  const getScore = (f) => Number(f.mass) + Number(f.height);

  const semiWinners = semiFinals.map(([f1, f2]) => getScore(f1) > getScore(f2) ? f1 : f2);
  const final = [semiWinners[0], semiWinners[1]];
  const champion = getScore(final[0]) > getScore(final[1]) ? final[0] : final[1];

  res.render("fights.ejs", { round1, semiFinals, final, champion });
});
app.get("/fighter/:id", async (req, res) => {
  const response = await axios.get(`${swApi}people/${req.params.id}`);
  const fighter = response.data;
//   console.log(fighter);
  res.render("fighter.ejs", { fighter });
});



app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})