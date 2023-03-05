# SeattleJS CLI

### Getting Started

1. `git clone https://github.com/fx-wood/seattlejs-airtable-cli`
2. `cd seattlejs-airtable-cli`
3. `npm install`

### Make a Personal Access Token (PAT)

1. visit https://airtable.com/create/tokens
2. create new token, give it a useful name
3. copy the sample .env file: `cp .env-sample .env`
4. paste the PAT into the .env file

### Get the Base ID and the Table IDs

1. visit https://airtable.com/developers/web/api/introduction
2. if you are logged in and have permission, click the button at the bottom after the text
   `To view API documentation that is generated for a particular base, see below:`
3. search for the text `The ID of this base is` and copy the base ID into the .env file
4. search for the text `The id for Events is` and copy the table id into the .env file
5. search for the text `The id for Speakers is` and copy the table id into the .env file

### Run the CLI
1. `npm run all`
2. copy the contents of `speakers.json`, `talks.json`, and `images/` into the website

If you only need to generate speaker images/json (not talks) run the following:

1. `npm run speakers`
2. copy the contents of `speakers.json` and `images/` into the website
