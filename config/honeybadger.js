import Honeybadger from 'honeybadger';

Honeybadger.configure({
  apiKey: process.env.HONEYBADGER_API_KEY
});

export default Honeybadger;
