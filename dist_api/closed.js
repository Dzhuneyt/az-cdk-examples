'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('aws-sdk');
require('mailparser');
require('querystring');

const e={success:{ok:200,created:201,accepted:202},redirect:{movedPermanently:301,found:302,seeOther:303},clientError:{badRequest:400,unauthorized:401,forbidden:403,notFound:404,unprocessable:422},serverError:{internal:500}};

const h={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":!0},p={ok:(e$1,t={},r=!1)=>({statusCode:e.success.ok,headers:{...t,...h},body:r?e$1:JSON.stringify(e$1)}),created:(e$1,t={},r=!1)=>({statusCode:e.success.created,headers:{...t,...h},body:r?e$1:JSON.stringify(e$1)}),accepted:(e$1,t={},r=!1)=>({statusCode:e.success.accepted,headers:{...t,...h},body:r?e$1:JSON.stringify(e$1)}),badRequest:(e$1,t={},r=!1)=>({statusCode:e.clientError.badRequest,headers:{...t,...h},body:r?e$1:JSON.stringify({errorMessage:"[ERROR] "+e$1})}),unauthorized:(e$1,t={},r=!1)=>({statusCode:e.clientError.unauthorized,headers:{...t,...h},body:r?e$1:JSON.stringify({errorMessage:"[ERROR] "+e$1})}),forbidden:(e$1,t={},r=!1)=>({statusCode:e.clientError.forbidden,headers:{...t,...h},body:r?e$1:JSON.stringify({errorMessage:"[ERROR] "+e$1})}),notFound:(e$1,t={},r=!1)=>({statusCode:e.clientError.notFound,headers:{...t,...h},body:r?e$1:JSON.stringify({errorMessage:"[ERROR] "+e$1})}),unprocessable:(e$1,t={},r=!1)=>({statusCode:e.clientError.unprocessable,headers:{...t,...h},body:r?e$1:JSON.stringify({errorMessage:"[ERROR] "+e$1})}),serverError:(e$1,t={},r=!1)=>({statusCode:e.serverError.internal,headers:{...t,...h},body:r?e$1:JSON.stringify({errorMessage:"[ERROR] "+e$1})})};

const closed = async (event) => {
    return p.ok({ message: `RESTRICTED: path = ${event.path}` });
};

exports.closed = closed;
