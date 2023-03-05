# SeattleJS CLI

### Getting Started

1. navigate to the root of the seattlejs/seattlejs.com project
2. `cd cli`
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
6. seatch for the text `The id for Sponsors is` and copy the table id into the .env file

### Run the CLI
To generate speakers and talks do:
1. `npm run all`

To generate sponsors do:
1. `npm run speakers

