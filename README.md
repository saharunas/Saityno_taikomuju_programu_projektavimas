# Sprendžiamo uždavinio aprašymas
## Sistemos paskirtis
Bendro projekto tikslas – sukurti mobiliają programėlę, kurioje naudotojas galėtų tobulinti save, siekiant savo užsibrėžtų tikslų su programėlės pagalba. Šiame projekte bus sukuriama tik dalis šio bendro projekto, ta dalis apims visa bendruomenės posistemę.
	Veikimo principas – projektą sudarys trys dalys: 
- Mobilioji aplikacija kurią naudosis svečiai, naudotojai ir administratoriai;
-	Serverinė dalis, kurioje bus visos aplikacijos programavimo sąsajos (API);
-	Duomenų bazė, kurioje bus saugoma visa naudotojų ir bendruomenių informaciją.
## Funkciniai reikalavimai
__Svečias__ galės:
-	Prisiregistruoti prie sistemos;
-	Prisijungti prie sistemos;
-	Peržiūrėti visą bendruomenių sąrašą;
-	Peržiūrėti bendruomenę.

__Registruotas sistemos naudotojas__ galės:
-	Atlikti visus veiksmus kaip ir svečias;
-	Atsijungti nuo sistemos.
-	Valdyti bendruomenes:
    -	Sukurti bendruomenę;
    -	Redaguoti bendruomenę;
    -	Pašalinti bendruomenę.
-	Valdyti įrašus
    -	Sukurti įrašą;
    -	Redaguoti įrašą;
    -	Peržiūrėti įrašą;
    -	Pašalinti įrašą;
    -	Peržiūrėti visų įrašų sąrašą.
-	Valdyti komentarus
    -	Sukurti komentarą;
    -	Redaguoti komentarą;
    -	Peržiūrėti komentarus;
    -	Pašalinti komentarą;
    -	Peržiūrėti visų komentarų ant vieno įrašo sąrašą.

__Sistemos administratorius__ galės:
-	Atlikti visus veiksmus kaip ir prisijungęs naudotojas;
-	Peržiūrėti visų naudotojų sąrašą;
-	Peržiūrėti visus konkrečios bendruomenės komentarus;
-	Užblokuoti naudotoją.

## Sistemos architektūra
Klientinės dalies kūrimui bus naudojamas React Native karkasas pritaikymui skirtingiems įrenginiams;
Serverio dalis bus kuriama naudojant .NET karkasą ir „EntityFramework“ biblioteką;
Duomenų bazei bus naudojama PostgreSQL duomenų bazės valdymo sistema.

# Pagrindiniai taikomosios srities objektai
Bendruomenė (Community) -> Įrašas (Post) -> Komentaras (Comment)
