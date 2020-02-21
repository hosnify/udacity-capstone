import * as uuid from 'uuid'
import { BookItem } from '../models/BookItem'
import { parseUserId } from '../auth/utils'
import { ItemAccess } from '../dataAccess/accessLayer'
import { CreateBookRequest } from '../requests/CreateBookRequest'

const itemAccess = new ItemAccess()

export async function createBookItem(
  newBookItem: CreateBookRequest,
  authorization: string
): Promise<BookItem> {
  
  const newItemId = uuid.v4()
  var userId = 'none'

  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }
  
  

  const item: BookItem = {
    bookId: newItemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newBookItem
  }
  
  return await itemAccess.createItem(item)
  

}

export async function getAllBooksLogic(
  authorization: string
): Promise<BookItem[]>{
  
  var userId = 'none'  
  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }

   const items = await itemAccess.getAllItems(userId)
   
   return items

}
