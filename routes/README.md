För att starta koden:
- Om man kör lokalt: 
1. Gör en oauth app på github.
2. Spara ner client_id och client_secret på oauth appen i en .env fil. Döp dom till CLIENT_ID och CLIENT_SECRET.
3. starta node app.js i terminalen

- Om man går in på servern:
1. Gå in på http://159.203.165.169:8000/

Svar på frågorna

1. Jag har implementerat HATEOAS som så att på första sidan så kan man välja mellan att gå vidare antingen till sidan cakes där man kan se alla tårtor som finns i bageriet, eller så kan man gå till sidan bakers där man ser alla bagare. Jag tycker det var ett bra sätt att starta eftersom min tanke med apiet är att det ska vara ett bageri, och det man vill se är förmodligen vilka tårtor som finns, samt vilka personer som jobbar där. När man ser alla kakorna, så kan man gå vidare till en enskild sida för alla specifika kakor där man kan se mer information om dem. Jag valde att göra så för att man är förmodligen bara intresserad av att se mer information om vissa tårtor och då känns det lätt att gå in på dem enskilt. Går man in på sidan bakers så måste man logga in för att kunna se alla bagare. När man har loggat in så listats alla bagare. Man kan då även gå vidare till varsin enskild sida där alla tårtor som den bagaren har bakat finns listade. Detta tycker jag känns tydligt och bra eftersom om man är intresserade av att att vilka som jobbar där så är man nog också intresserad av att se vilka tårtor som just dem har bakat. När man är inloggad så finns det också en länk till att logga ut. På varje sida så finns det en länk tillbaka till startsidan. Det finns också en länk att posta till när man vill göra en webhook.

2. Då skulle jag sätta så att man kan välja i koden när man sätter content-type, till vilken man vill ha. Om de är json så blir de json exempelvis.

3. Jag valde att logga in med github. Dels för att jag ville testa på det eftersom jag även ska göra det i den andra kursen. Men också för att jag tänker att de som ska använda sig av mitt api har github, och därför är det ett bra sätt. Jag hade lika gärna kunnat använda exempelvis facebook, men det känns mer relevant med github eftersom det är en examinationsuppgift i skolan och alla har github. Nackdelar med detta kan ju vara om jag ska använda api:et utanför skolan och de som ska logga in inte har github. Men då skulle jag kunna lägga till så att man kan logga in med facebook eller mail om man hellre vill det.

4. Min webhook fungerar så att man får posta en egen url till sidan localhost:8000/webhooks (lokalt) eller sidan http://159.203.165.169:8000/webhooks (på servern). Den urlen som man postar sparas ner i databasen. Sedan varje gång när någon postar en ny tårta så får man upp det objektet och ett meddelande att en ny tårta har skapats på den urlen som har sparats i databasen.

5. Om jag skulle göra om uppgiften så skulle jag nog lägga upp en plan och läsa på lite mer innan jag började. Nu har jag kommit på saker och kollat upp hur man ska göra olika saker allt eftersom jag har gjort uppgiften. Jag skulle även lägga till så att det skickas med statuskoder när man skickar responsen till klienten.

6. Jag har inte gjort något extra utöver kraven.