const cors = require('cors');

const express = require('express'); // importovao sam express
const mysql = require('mysql');     //improtivao sam mysql
require('dotenv').config();

const app = express();
app.use(cors());
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000; // ovo je port


app.listen(PORT, ()=>{        // da ga pokrene, osluskuje port 3000
    
    console.log('server je startovan');
})            

// kreiranje konekcije mysql 
const db = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user:'bed46095b1465c',
    password: '16c21bd2',
    database: 'heroku_f29ec228f2a6eab'
});

// povezivanje

db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('Povezan je sa mysql bazom');
});




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//insert vrednost grafikona





//#region Upiti za vrste rashoda

//select vrste rashoda

app.get('/selectVrsteRashoda', (req,res)=> {
    
    let sql = 'SELECT * FROM vrste_rashoda';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
        
    });
});

// obrisi vrstu rashoda 

app.delete('/obrisiVrstuRashoda', (req,res)=> {
   
    
    let sql = `Delete from vrste_rashoda where id = ${req.body.ID} `;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('obrisan je sadrzaj');
    });
}); 
 
// update vrstu rashoda
app.put('/updateVrsteRashoda', (req,res)=> {
    
    let sql = 'Update vrste_rashoda set Name = "'+req.body.name +'", Slicica = "'+ req.body.slicica +'" where ID = '+ req.body.ID+'';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err; 
        console.log(result);
        res.send('izmenjen je sadrzaj');
    });
}); 

app.post("/dodajVrstuRashoda", function (req, res) {        
    
    
    let sql = 'INSERT INTO vrste_rashoda (Name,Slicica,Color,legendFontColor,legendFontSize) values ("'+req.body.name +'","'+ req.body.slicica +'","'+req.body.color+'","'+ req.body.legendFontColor+'","'+ req.body.legendFontSize+'")';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
});

//#endregion

//#region Upiti vrstePrihoda

app.get('/selectVrstePrihoda', (req,res)=> {
    
    let sql = 'SELECT * FROM vrste_prihoda';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
        
    });
});

app.post("/dodajVrstuPrihoda", function (req, res) {        
    
    
    let sql = 'INSERT INTO vrste_prihoda (Name,Slicica,Color,legendFontColor,legendFontSize) values ("'+req.body.name +'","'+ req.body.slicica +'","'+req.body.color+'","'+ req.body.legendFontColor+'","'+ req.body.legendFontSize+'")';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
});

app.delete('/obrisiVrstuPrihoda', (req,res)=> {
    
    
    let sql = `Delete from vrste_prihoda where id = ${req.body.ID} `;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('obrisan je sadrzaj');
    });
}); 

app.put('/updateVrstePrihoda', (req,res)=> {
    
    let sql = 'Update vrste_prihoda set Name = "'+req.body.name +'", Slicica = "'+ req.body.slicica +'" where ID = '+ req.body.ID+'';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err; 
        console.log(result);
        res.send('izmenjen je sadrzaj');
    });
}); 

//#endregion


//#region Upiti za dnevni prikaz

//ovako je bilo 
/*
app.post("/dodajVrednostRashoda", function (req, res) {        
    
    let sql = 'INSERT INTO lista_rashoda (Datum,Vrednost,ID_Vrste_Rashoda) values ("'+req.body.Datum +'", "'+ req.body.Vrednost +'","'+ req.body.ID_Vrste_Rashoda +'")';
    let query = db.query(sql, (err,result)=>{
        if(err) {throw err; res.send(req.body.Datum);};
        console.log(result);
        res.send('post 1 dodat');
});
});*/
app.post("/dodajVrednostRashoda/:datum/:vrednost/:ID_Vrste_Rashoda", function (req, res) {        
    let sql = 'INSERT INTO lista_rashoda (Datum,Vrednost,ID_Vrste_Rashoda) values ("'+req.params.datum +'", "'+ req.params.vrednost +'","'+ req.params.ID_Vrste_Rashoda +'")';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
});



//listu troskova vracam na taj dan
app.get('/selectListaRashoda/:datum', (req,res)=> {
    //console.log(req.params.datum);
    let sql = 'SELECT * FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum = "' + req.params.datum +'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//vracam top 5  vrednosti rashoda za grafikon
app.get('/grafikonRashodaDan/:datum', (req,res)=> {
    
    //let sql = 'SELECT * FROM `LISTA_rashoda` order by `vrednost` desc LIMIT 5;';
    let sql = 'SELECT name,vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum = "' + req.params.datum +'"order by `vrednost` desc LIMIT 5';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
        
    });
});


//vraca ukupne prihode na taj dan
app.get('/selectUkupniPrihod/:datum', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_prihoda WHERE Datum = "' + req.params.datum +'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.get('/selectUkupniRashod/:datum', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_rashoda WHERE Datum = "' + req.params.datum +'"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});
// kartica troska
app.get('/selectKarticaRashoda/:rashod', (req,res)=> {
    //console.log("izvrsava se");
    //console.log(req.params.rashod);
    let sql = 'SELECT DATE_FORMAT(Datum, "%Y-%m-%d") as Datum , Vrednost FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Name = "' + req.params.rashod +'"order by `vrednost` desc';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});
// kartica prihoda na dan
app.get('/selectKarticaPrihoda/:dan', (req,res)=> {
    //console.log("izvrsava se");
    console.log(req.params.dan);

    let sql = 'SELECT Name, Vrednost, Slicica,lista_prihoda.ID FROM lista_prihoda, vrste_prihoda where lista_prihoda.ID_Vrste_prihoda = vrste_prihoda.ID and Datum = "' + req.params.dan +'"order by `vrednost` desc';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.post("/dodajVrednostPrihoda", function (req, res) {        
    
    let sql = 'INSERT INTO lista_prihoda (Datum,Vrednost,ID_Vrste_Prihoda) values ("'+req.body.Datum +'", "'+ req.body.Vrednost +'","'+ req.body.ID_Vrste_Prihoda +'")';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 dodat');
});
});
app.delete('/obrisiPrihod', (req,res)=> {
      
    
    let sql = `Delete from lista_prihoda where ID = ${req.body.ID} `;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('obrisan je sadrzaj');
    });
}); 


//#endregion


//#region Upiti za mesecni prikaz

app.get('/selectMesecniRashod/:mesec', (req,res)=> { 
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_rashoda WHERE Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//vraca ukupne prihode na taj mesec
app.get('/selectMesecniPrihod/:mesec', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_prihoda WHERE Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//listu troskova vracam za taj mesec
app.get('/selectListaRashodaMesec/:mesec', (req,res)=> {
    //console.log(req.params.datum);
    let sql = 'SELECT * FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.get('/grafikonRashodaMesec/:mesec', (req,res)=> {
    
    //let sql = 'SELECT * FROM `LISTA_rashoda` order by `vrednost` desc LIMIT 5;';
    let sql = 'SELECT name,vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31" order by `vrednost` desc LIMIT 5';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
        
    });
});

app.get('/selectKarticaPrihodaMesec/:mesec', (req,res)=> {

    let sql = 'SELECT Name, Vrednost, Slicica,lista_prihoda.ID FROM lista_prihoda, vrste_prihoda where lista_prihoda.ID_Vrste_prihoda = vrste_prihoda.ID and Datum BETWEEN "2020-'+ req.params.mesec +'-01" AND "2020-'+ req.params.mesec+'-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        res.send(result);
   });

});
//#endregion



//#region Upiti za godisnji prikaz

app.get('/selectGodisnjiRashod/:godina', (req,res)=> { 
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_rashoda WHERE Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//vraca ukupne prihode na taj mesec
app.get('/selectGodisnjiPrihod/:godina', (req,res)=> {
    
    let sql = 'SELECT sum(Vrednost) as Vrednost from lista_prihoda WHERE Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

//listu troskova vracam za taj mesec
app.get('/selectListaRashodaGodina/:godina', (req,res)=> {
    //console.log(req.params.datum);
    let sql = 'SELECT * FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum);
   });
});

app.get('/grafikonRashodaGodina/:godina', (req,res)=> {
    
    //let sql = 'SELECT * FROM `LISTA_rashoda` order by `vrednost` desc LIMIT 5;';
    let sql = 'SELECT name,vrednost,color,legendFontColor,legendFontSize FROM lista_rashoda, vrste_rashoda where lista_rashoda.ID_Vrste_rashoda = vrste_rashoda.ID and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31" order by `vrednost` desc LIMIT 5';
    
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        //console.log(result);
        res.send(result);
        //res.send('postovi prikazani');
     // res.send(req.params.datum); 
        
    });
});
 
app.get('/selectKarticaPrihodaGodina/:godina', (req,res)=> {

    let sql = 'SELECT Name, Vrednost, Slicica,lista_prihoda.ID FROM lista_prihoda, vrste_prihoda where lista_prihoda.ID_Vrste_prihoda = vrste_prihoda.ID and Datum BETWEEN "'+ req.params.godina+'-01-01" AND "'+ req.params.godina+'-12-31"';
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        res.send(result);
   });

});

//#endregion
