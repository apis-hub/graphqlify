export default function (rootValue) {
  return function(error) {
    if (error instanceof HTTPError401 || error instanceof HTTPError419 || error instanceof HTTPError412) {
      rootValue.statusCode = error.statusCode;
    }
    throw error
  }
}
