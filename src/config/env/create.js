const fs = require('fs');
const path = require('path');
const ENV = require('../../services/environment')();

init();

function init(){
  const data = buildDotEnvFileData(ENV);
  fs.writeFileSync(path.join(__dirname, '../../../.env'), data);
}

function buildDotEnvFileData({ DB }){
  const dbAuth = buildColonSeparatedValue(DB.USER, DB.PASS);
  const dbHost = buildColonSeparatedValue(DB.HOST, DB.PORT);
  return [
    `DATABASE_URL="${DB.PROVIDER}://${dbAuth}@${dbHost}/${DB.NAME}"`
  ].join('\n');
}

function buildColonSeparatedValue(leftValue, rightValue){
  return rightValue ? `${leftValue}:${rightValue}` : leftValue;
}
