/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../user/user.Controller';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router
} from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  UserLoginResponse: {
    dataType: 'refObject',
    properties: {
      aToken: { dataType: 'string', required: true },
      rToken: { dataType: 'string', required: true }
    },
    additionalProperties: false
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ITsoaSuccessResponse_UserLoginResponse_: {
    dataType: 'refObject',
    properties: {
      resultType: { dataType: 'string', required: true },
      error: { dataType: 'enum', enums: [null], required: true },
      success: { ref: 'UserLoginResponse', required: true }
    },
    additionalProperties: false
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ITsoaErrorResponse: {
    dataType: 'refObject',
    properties: {
      resultType: { dataType: 'string', required: true },
      error: {
        dataType: 'nestedObjectLiteral',
        nestedProperties: {
          data: {
            dataType: 'union',
            subSchemas: [
              { dataType: 'any' },
              { dataType: 'enum', enums: [null] }
            ]
          },
          reason: {
            dataType: 'union',
            subSchemas: [
              { dataType: 'string' },
              { dataType: 'enum', enums: [null] }
            ]
          },
          errorCode: { dataType: 'string' }
        },
        required: true
      },
      success: { dataType: 'enum', enums: [null], required: true }
    },
    additionalProperties: false
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ITsoaSuccessResponse_string_: {
    dataType: 'refObject',
    properties: {
      resultType: { dataType: 'string', required: true },
      error: { dataType: 'enum', enums: [null], required: true },
      success: { dataType: 'string', required: true }
    },
    additionalProperties: false
  }
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'throw-on-extras',
  bodyCoercion: true
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsUserController_login: Record<string, TsoaRoute.ParameterSchema> = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    body: {
      in: 'body',
      name: 'body',
      required: true,
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        userId: { dataType: 'string', required: true },
        userPassword: { dataType: 'string', required: true }
      }
    }
  };
  app.post(
    '/user/login',
    ...fetchMiddlewares<RequestHandler>(UserController),
    ...fetchMiddlewares<RequestHandler>(UserController.prototype.login),

    async function UserController_login(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserController_login,
          request,
          response
        });

        const controller = new UserController();

        await templateService.apiHandler({
          methodName: 'login',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserController_refresh: Record<string, TsoaRoute.ParameterSchema> =
    {
      req: { in: 'request', name: 'req', required: true, dataType: 'object' },
      body: {
        in: 'body',
        name: 'body',
        required: true,
        dataType: 'nestedObjectLiteral',
        nestedProperties: { token: { dataType: 'string', required: true } }
      }
    };
  app.post(
    '/user/refresh',
    ...fetchMiddlewares<RequestHandler>(UserController),
    ...fetchMiddlewares<RequestHandler>(UserController.prototype.refresh),

    async function UserController_refresh(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserController_refresh,
          request,
          response
        });

        const controller = new UserController();

        await templateService.apiHandler({
          methodName: 'refresh',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
