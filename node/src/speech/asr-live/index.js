const path = require('path');
const fs = require('fs');

const WebSocket = require('ws');

// config
const apiConfigs = {
  baseUrl: 'wss://api.amerandish.com/v1',
  actionUrl: '/speech/asrlive',
  authKey: '<YOUR_API_KEY>',
};
// wav file path
const filePath = path.resolve('<YOUR_WAV_FILE_PATH>');

// Buffer Chunk size
const BUFFER_CHUNK = 100 * 1000;
// Buffer Sending Interval
const BUFFER_INTERVAL = 2 * 1000;

// Convert Base64 to Array Buffer
function convertBase64ToArrayBuffer(base64) {
  var arrayBuffer = new ArrayBuffer(base64.length);
  var byteNumbers = new Uint8Array(arrayBuffer);
  for (let i = 0; i < base64.length; i++) {
    byteNumbers[i] = base64.charCodeAt(i);
  }
  return arrayBuffer;
}

async function main() {
  // create socket url and add jwt Authorization to query parameter
  const url =
    apiConfigs.baseUrl + apiConfigs.actionUrl + `?jwt=${apiConfigs.authKey}`;
  // create web socket client
  const ws = new WebSocket(url);
  ws.on('connect', function open() {
    console.log('connect to socket server');
  });
  ws.on('open', function open() {
    console.log('open connection to socket server');
    // read wav file and encode as base64
    const stream = fs.readFileSync(filePath, {
      encoding: 'base64',
    });
    // convert base64 to array buffer
    const buffer = convertBase64ToArrayBuffer(stream);
    let interval;
    let index = 0;
    console.log(`buffer size ${buffer.byteLength}`);
    // create interval for sending buffers
    interval = setInterval(() => {
      const begin = index;
      let end = index + BUFFER_CHUNK;
      if (end > buffer.byteLength) {
        end = buffer.byteLength;
      }
      // send chunk of wav file
      ws.send(buffer.slice(begin, end));
      console.log(`sending buffer from ${begin} to ${end}`);
      index += BUFFER_CHUNK;
      if (end === buffer.byteLength) {
        // remove sending interval
        clearInterval(interval);
      }
    }, BUFFER_INTERVAL);
  });

  ws.on('message', function incoming(data) {
    // check response.json file for response model
    console.log('message', data);
    const {
      transcriptionId,
      duration,
      inferenceTime,
      status,
      partial,
      results,
    } = data;
  });

  ws.on('error', (e) => {
    console.log('error', e);
  });
}

main();
