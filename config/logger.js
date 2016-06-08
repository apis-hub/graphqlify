import morgan from 'morgan';
import { ljust } from 'string-just';

function colorStatus(status) {
  let color = 'white';
  if (status < 300) {
    color = 'green';
  } else if (status < 400) {
    color = 'cyan';
  } else if (status < 500) {
    color = 'yellow';
  } else {
    color = 'red';
  }
  return `${status}`[color];
}

function colorDuration(duration) {
  let color = 'white';
  if (duration < 500) {
    color = 'green';
  } else if (duration < 1000) {
    color = 'yellow';
  } else if (duration < 2500) {
    color = 'magenta';
  } else {
    color = 'red';
  }
  return ljust(`${ duration } ms`, '10000.00 ms'.length)[color];
}

function colorMethod(method) {
  let colormap = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'yellow',
    PATCH: 'yellow',
    DELETE: 'red',
    OPTIONS: 'cyan',
    HEAD: 'white'
  };
  return `${ ljust(method, 'OPTIONS'.length) }`[colormap[method]];
}

function colorUrl(url) {
  return `${ url }`['white'];
}

morgan.format('bf-simple', (tokens, req, res) => {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return;
  }

  // calculate diff
  let ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;

  // return truncated value
  let duration = ms.toFixed(2);
  return [
    ljust('GRAPHQL', 10),
    '|',
    colorMethod(req.method),
    '>',
    colorStatus(res.statusCode),
    '|',
    colorDuration(duration),
    '|',
    colorUrl(req.originalUrl)
  ].join(' ');
});

export default morgan('bf-simple');
