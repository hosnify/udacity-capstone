import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'

const XAWS = AWSXRay.captureAWS(AWS)

import { BookItem } from '../models/BookItem'

export class ItemAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tableName = process.env.BOOKS_TABLE,
    private readonly indexName = process.env.BOOKS_USR_INDX
    ) {
  }

  
  async getAllItems(userId: string): Promise<BookItem[]> {

    const result = await this.docClient.query({
      TableName : this.tableName,
      IndexName : this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()
    const BookItems = result.Items

    return BookItems as BookItem[]

  }

  
  async createItem(item: BookItem): Promise<BookItem> {
    await this.docClient.put({
      TableName: this.tableName,
      Item: item
    }).promise()

    return item
  }
  

  async isItemExists (itemId: string){
    const result = await this.docClient.query({
      TableName : this.tableName,
      KeyConditionExpression: 'bookId = :bookId',
      ExpressionAttributeValues: {
          ':bookId': itemId
      }
    }).promise()
  
    return (result.Count >0)
  }
  
  async updateItem(itemId: string, updatedItem: UpdateBookRequest): Promise<UpdateBookRequest>{
    await this.docClient.update({
        TableName: this.tableName,
        Key:{
          "bookId": itemId
        },
        UpdateExpression: "set #nm = :bookName, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
          ":bookName": updatedItem.name,
          ':dueDate': updatedItem.dueDate,
          ":done": updatedItem.done   
        },
        ExpressionAttributeNames: {
          "#nm": "name"
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()
  
    return updatedItem
  }

  async addAttachmentUrl(itemId: string, attachmentUrl: string){
    await this.docClient.update({
      TableName: this.tableName,
      Key:{
        "bookId": itemId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  }
  
  async deleteItem(itemId: string){
    await this.docClient.delete({
      TableName: this.tableName,
      Key:{
        "bookId": itemId
      }
    }).promise()
  }
  
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}


