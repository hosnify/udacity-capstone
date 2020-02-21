import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { ItemAccess } from '../../dataAccess/accessLayer'
import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4' 
})
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bookAccess = new ItemAccess()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const bookId = event.pathParameters.bookId
  logger.info('URL Parameters', {'book': bookId})
  
  const validBookId = await bookAccess.isItemExists(bookId)
  if (!validBookId){
    logger.error('invalid bookId', {'book': bookId})
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Book does not exist'
    }
  }
  
  const attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${bookId}`
  const url = getUploadUrl(bookId)
  
  await bookAccess.addAttachmentUrl(bookId, attachmentUrl)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }

}

function getUploadUrl(bookId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: bookId,
    Expires: urlExpiration
  })
}
