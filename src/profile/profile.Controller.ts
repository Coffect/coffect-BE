import {
  Controller,
  Route,
  Post,
  Tags,
  SuccessResponse,
  Request,
  Body,
  Response,
  Get,
  FormField,
  UploadedFile,
  Security
} from 'tsoa';

import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse
} from '../config/tsoaResponse';
import { ProfileService } from './profile.Service';
@Route('profile')
@Tags('Profile Controller')
export class ProfileController extends Controller {
  private profileService: ProfileService;
  constructor() {
    super();
    this.profileService = new ProfileService();
  }

  @Get('/')
  @Security('jwt_token')
  public async myprofile(
    @Request() req: Express.Request
  ): Promise<ITsoaSuccessResponse<number>> {
    const userId = req.user.index;
    const data = await this.profileService.myProfile(userId);
    return new TsoaSuccessResponse(userId);
  }
}
