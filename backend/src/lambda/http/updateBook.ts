import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBookRequest } from '../../requests/UpdateBookRequest'

import 'source-map-support/register'

import { ItemAccess } from '../../dataAccess/accessLayer'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateBook')

const bookAccess = new ItemAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId
  const updatedBook: UpdateBookRequest = JSON.parse(event.body)

  const validBookId = await bookAccess.isItemExists(bookId)  
  if (!validBookId){
    logger.error('not valid', {'validBookId': bookId})
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Book item does not exist'
    }
  }
  
  await bookAccess.updateItem(bookId, updatedBook)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}

