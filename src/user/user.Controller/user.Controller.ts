import { Request, Response } from 'express';
import { userError } from '../user.Message/user.Message';


export const testuserInfo = async (
  req : Request,
  res : Response
):Promise<void> => {
  try {
    const user = req.body as string;

    if(!user) {
      res.status(userError.missingField.statusCode).json(userError.missingField);
      return;
    }

  } catch (error : any) {
    res.status(userError.serverError.statusCode).json(userError.serverError);
  }
};