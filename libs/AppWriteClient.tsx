import { Account, Client, ID, Databases, Query, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(String(process.env.NEXT_PUBLIC_APPWRITE_URL))
    .setProject(String(process.env.NEXT_PUBLIC_ENDPOINT));

//const client = new Client();
    //client.setProject('675c8eb7002b9d62a159');
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage, Query, ID }

