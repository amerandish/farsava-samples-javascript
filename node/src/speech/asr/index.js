const path = require('path');
const fs = require('fs');

const axios = require('axios').default;

// config
const apiConfigs = {
  baseUrl: 'https://api.amerandish.com/v1',
  actionUrl: '/speech/asr',
  authKey: '<YOUR_API_KEY>',
};
// wav file path
const filePath = path.resolve('<YOUR_WAV_FILE_PATH>');

async function main() {
  try {
    // create request url
    const url = apiConfigs.baseUrl + apiConfigs.actionUrl;
    // create request Config and Add Authorization Header
    const axiosConfig = {
      headers: {
        Authorization: `bearer ${apiConfigs.authKey}`,
      },
    };
    // read wav file and encode as base64
    const stream = fs.readFileSync(filePath, {
      encoding: 'base64',
    });
    // request payload
    const payload = {
      config: {
        audioEncoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'fa',
        maxAlternatives: 1,
        profanityFilter: true,
        asrModel: 'default',
        languageModel: 'general',
      },
      audio: {
        data: stream,
      },
    };
    // make request and store result
    const result = await axios.post(url, payload, axiosConfig);
    if (result.status === 200) {
      // check response.json file for response model
      // Success Result
      const {
        transcriptionId,
        duration,
        inferenceTime,
        status,
        results,
      } = result.data;
      console.log('success', {
        transcriptionId,
        duration,
        inferenceTime,
        status,
        results,
      });
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      // check your internet connection
      console.log('please check your internet connection');
    } else if (error.response) {
      const { data, status } = error.response;
      if (status === 400) {
        // check request data model
        console.log('bad request', data);
      } else if (status === 401) {
        // check token expire or not set
        console.log('unauthorized', data);
      } else if (status === 403) {
        // check token scope
        console.log('forbidden', data);
      } else if (status === 405) {
        // http request method not allow
        console.log('method not allow', data);
      } else if (status === 429) {
        // try later, too many request at same time
        console.log('to many request', data);
      } else if (status === 500) {
        // report/call us
        console.log('internal error', data);
      } else {
        // other http status response codes
        console.log('error other response status code', status);
      }
    } else {
      console.log('other exception', error);
    }
  }
}

main();
