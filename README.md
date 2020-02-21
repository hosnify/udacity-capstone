# ToRead list - serverless app - udacity cloud capstone

a simple book list application using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching book items. Each book item can optionally have an attachment image. Each user only has access to book items that he/she has created.

# BOOK items

The application should store books , and each book item contains the following fields:

* `bookId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a book  (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which reading book should be completed
* `done` (boolean) - true if reading was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a book item


## Logging

The  code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. 
```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

