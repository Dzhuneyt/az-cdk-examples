'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var e$1 = require('aws-sdk');
var e$1__default = _interopDefault(e$1);
require('mailparser');
require('querystring');

const s=e=>Object.keys(e).reduce((t,r)=>({...t,[r]:Array.isArray(e[r])?e[r].slice(0):"object"==typeof e[r]?s(e[r]):e[r]}),{}),b=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);

const r=async(t,s,n,o,i="us-east-1")=>{const a={Destination:{ToAddresses:s},Message:{Subject:{Charset:"UTF-8",Data:n},Body:{Text:{Charset:"UTF-8",Data:o}}},Source:t},r=new e$1__default.SES({region:i});await r.sendEmail(a).promise();};

const r$1=async(r,s,o,t=!1,n="us-east-1")=>{const i=new e$1__default.CognitoIdentityServiceProvider({region:n});t&&console.log("... creating group ...");const a={GroupName:o,UserPoolId:r};try{await i.getGroup(a).promise();}catch(e){await i.createGroup(a).promise();}t&&console.log("... adding user to group ...");const l={GroupName:o,UserPoolId:r,Username:s};await i.adminAddUserToGroup(l).promise();},t=async(r,s,o,t="us-east-1")=>{const n=new e$1__default.CognitoIdentityServiceProvider({region:t});await n.adminUpdateUserAttributes({UserPoolId:r,Username:s,UserAttributes:Object.keys(o).map(e=>({Name:e,Value:o[e]}))}).promise();};

const c=e=>{const t=Object.keys(e);return {UpdateExpression:"SET "+[...t.map((e,t)=>`#y${t} = :x${t}`)].join(", "),ExpressionAttributeNames:t.reduce((e,t,n)=>({...e,[`#y${n}`]:t}),{}),ExpressionAttributeValues:t.reduce((t,n,s)=>({...t,[`:x${s}`]:e[n]}),{})}},l=async(t,n,s)=>{if(0===Object.keys(s).length)return null;const a=new e$1.DynamoDB.DocumentClient,r=c(s),i=await a.update({TableName:t,Key:n,ReturnValues:"ALL_NEW",...r}).promise();return i.Attributes?i.Attributes:null};

function e(t,e,n){if(!Object.prototype.hasOwnProperty.call(e,n))return !1;const o=typeof t[n];return typeof e[n]===o}const n=(t,e="")=>{t?(console.log(`[ERROR] object = ${JSON.stringify(t)}`),console.log(`[ERROR] property for key = ${e} doesn't exist or has incorrect type`)):console.log("[ERROR] object is null");};function o(t,r,l=!1,c){if(!r)return l&&n(r),null;const s={},f=Object.keys(t);for(const i of f){if(c&&c[i]&&!Object.prototype.hasOwnProperty.call(r,i))continue;if(!e(t,r,i))return l&&n(r,i),null;const f=r[i];if(Array.isArray(t[i]))s[i]=f.slice(0);else if("object"==typeof t[i]){const e=o(t[i],f,l);if(!e)return null;s[i]=e;}else s[i]=f;}return s}

const u=(e,t,r)=>{let s=`Hello ${t||e},\n\nYour account has been created successfully.\n\nEnjoy!\n`;return r&&(s+=`\n(account created with ${r} credentials)\n  `),{subject:"Welcome!",message:s}};const m=()=>Math.floor(Date.now()/1e3),g=(i,c,d=!1,l$1,g,y)=>async h=>{const{userName:p}=h,{email:f,name:b$1}=h.request.userAttributes;if(d&&console.log(">>> event = \n",JSON.stringify(h,void 0,2)),!p)throw new Error("cannot get userName from event data");if(!f)throw new Error("cannot get email from event data");const R=h.request.userAttributes["cognito:user_status"];let E;if("EXTERNAL_PROVIDER"===R&&(E=p.split("_")[0],d&&console.log(`account created with ${E} credentials`)),g&&y&&(d&&console.log("... setting access in user table ..."),await(async(r,s$1,n,i)=>{const{aspect:c}=s$1;if(!c)throw new Error(`aspect must be given in defaultData =\n${JSON.stringify(s$1,void 0,2)}`);const u=s(s$1);u.userId=n,u.email=i,b(u,"createdAt")&&(u.createdAt=m()),b(u,"unixCreatedAt")&&(u.unixCreatedAt=m()),delete u.userId,delete u.aspect;const d={userId:n,aspect:c},l$1=await l(r,d,u);if(!o(u,l$1))throw new Error("database is damaged")})(g,y,p,f)),i&&await r$1(h.userPoolId,p,i,d),"EXTERNAL_PROVIDER"===R&&await t(h.userPoolId,p,{email_verified:"true"}),c){d&&console.log("... sending confirmation email ...");const{subject:e,message:t}=l$1?l$1(f,b$1,E):u(f,b$1,E);await r(c,[f],e,t);}return h};

const r$2=(r,n=!1)=>{Object.keys(r).forEach(o=>{if(!b(process.env,o))throw new Error(`cannot find environment variable named "${o}"`);const t=process.env[o];if(!n&&!t)throw new Error(`environment variable "${o}" must not be empty`);r[o]=t;});};

const newAccess = () => ({
    userId: '',
    aspect: 'ACCESS',
    role: 'TRAVELLER',
    email: '',
});

const envars = {
    STAGE: '',
    DEFAULT_USER_GROUP: '',
    TABLE_USERS_PREFIX: '',
    EMAILS_SENDING_DOMAIN: '',
};
r$2(envars);
const tableUsers = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;
const senderEmail = `admin@${envars.EMAILS_SENDING_DOMAIN}`;
const verbose = true;
const emailMaker = undefined;
const handler = g(envars.DEFAULT_USER_GROUP, senderEmail, verbose, emailMaker, tableUsers, newAccess());

exports.handler = handler;
