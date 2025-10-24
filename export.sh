mongoexport --db=redditKnjige --collection=knjige_flattened --type=csv --fields=datum,link_reddit,korisnik,broj_upvote,knjiga,ISBN10,autori,područje,potpodručje,link_amazon,ocjena_amazon --out=knjige_ljudi_sa_reddita.csv
mongoexport --db=redditKnjige --collection=knjige --type=json --out=knjige_ljudi_sa_reddita.json 
mongodump --db redditKnjige
zip -r dump.zip ./dump
rm -r -v ./dump
