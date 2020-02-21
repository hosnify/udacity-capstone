import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateBookRequest } from '../../requests/CreateBookRequest'

import { createBookItem } from '../../businessLogic/itemsLogic'

import { createLogger } from '../../utils/logger'
const logger = createLogger('createBook')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('createBook handler Start', event)

  const newBook: CreateBookRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const item = await createBookItem(newBook, authorization)

  logger.info('CreateBook details', item)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }

}


