
# Farsava - ASR live Api (WebSocket)

First create an `API KEY` [here](https://panel.amerandish.com/)

## install dependencies

```bash
npm install
```

## configs
```javascript
const apiConfigs = {
  baseUrl: 'https://api.amerandish.com/v1',
  actionUrl: '/speech/asrlive',
  authKey: '<YOUR_API_KEY>',
};

const filePath = path.resolve('<YOUR_WAV_FILE_PATH>');
```

## run

```bash
npm start
```
or
```bash
node index.js
```

