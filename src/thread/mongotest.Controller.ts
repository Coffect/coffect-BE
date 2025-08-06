import { mongo } from '../config/prisma.config';
import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';

@Route('mongotest')
export class MongoTestController extends Controller {
  @Post('create')
  @SuccessResponse('200', 'created')
  public async createTestData(
    @Body() body: { userId: number; chatRoomId: string; messageBody: string }
  ): Promise<string> {
    const { userId, chatRoomId, messageBody } = body;

    const newMessage = await mongo.message.create({
      data: {
        userId,
        chatRoomId: chatRoomId,
        messageBody
      }
    });

    this.setStatus(201); // set response status to 201 Created
    return `Message created with ID: ${newMessage.id}`;
  }
}
