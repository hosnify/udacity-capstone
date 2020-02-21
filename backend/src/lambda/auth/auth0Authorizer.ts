import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')



export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const cert = `-----BEGIN CERTIFICATE-----
MIIDAzCCAeugAwIBAgIJeAhTMzWsEzH3MA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV
BAMTFGRldi1zYW1yYWEuYXV0aDAuY29tMB4XDTIwMDIyMDIwMzAzOFoXDTMzMTAy
OTIwMzAzOFowHzEdMBsGA1UEAxMUZGV2LXNhbXJhYS5hdXRoMC5jb20wggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDDPIDspUivNjupyFwEO5rpwfPIPgNT
VKDUusDNTayBJ8l0g/hXwJ570PMyi9H77ejYfnBmETxMcHexNfhFgNOaLoRu9OgR
/VhOuzELp1IPnMGqfgvMmI99ttOCMLVygt04p30SX1390BO2wiWUx2GQYCqWKUr+
UjJiceKyDxu9pZ1fBwhSRO7QN4/LUaGtux5T+uxwATI3UMMPAvSQnZBKrPA/qC6+
bvvdNloUr5XyUsi0/w+la0MqacR2jTqtQEVVghptlQR2Eur3fu8yyXlcIehw8Co0
i0HY6mSZAtsJxdLJvWxqEYQanHjedJ5A8hdYN+XP2GtwhW5GgAkB5ZJJAgMBAAGj
QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFNyZU0T5P6pf/S6Z9KNcWeXy
s5D/MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAhJCSsMobDGCd
xaIgicrK12B3dpwscNlXncqS2axUOLQkgn5tYSRHC6c3SJFpGT7MVhGF4qAqdFGK
cBngsGY62y32R57AdEbuy/CvdqXyH6lZg0VTPkcAOqwIzAKsnVCmiCkJHPOefdyi
oVSOvRjg4Nb70cJj8n5RwTQzGG5TqoE4n6pNmg9oQdFLbfPBG18C6UwKvb1Zj/Uk
cU1PgfiUXa0ZXftA+nMUUXsOvJCOLLMvnRpElJrhUTSEvRS9MqYPXPgqPe8pjX0w
1OmHw7Nw8WsGBTBqzgw/Xmm8heuuszuVSMOtaw1ecoeuLd75doM3MruT4Tn3rmHU
fsM4p03ZBw==
-----END CERTIFICATE-----`

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
