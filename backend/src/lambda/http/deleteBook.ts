import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { ItemAccess } from '../../dataAccess/accessLayer'
import { createLogger } from '../../utils/logger'


const bookAccess = new ItemAccess()

const logger = createLogger('deleteItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId
  logger.info('deleted book id', {'book': bookId})
  
  await bookAccess.deleteItem(bookId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }

}

