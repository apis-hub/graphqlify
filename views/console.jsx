import ReactDOM from "react-dom";
import GraphiQL from 'graphiql';
import fetch from "isomorphic-fetch";
import $ from "jquery";
import Url from "url";
import "jquery.cookie";

window.$ = $;
let graphqlEndpoint = window.location.origin + '/graphql';
let params = {};
if (window.location.search) {
  $.extend(params, document.location.search.replace(/(^\?)/, '').split("&").map(function(n) {
    var kv = n.split("=");
    params[kv[0]] = kv[1] === undefined ? true : kv[1];
  }))
}

function graphQLFetcher(graphQLParams) {
  let headers = {};

  headers['Content-Type'] = 'application/json';

  if ($.cookie('token')) {
    headers['Authorization'] = `JWT ${$.cookie('token')}`;
  }

  return fetch(graphqlEndpoint, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json());
}

if (params.token) {
  $.cookie('token', params.token, {
    expires: 7
  });
  window.location.search = '';
} else if (params.reset) {
  $.removeCookie('token');
  window.location.search = '';
} else if (!$.cookie('token')) {
  graphQLFetcher({
    query: "query {root{url}} "
  }).then(function(json) {
    var url = Url.parse(json.data.root.url);
    url.hostname = url.hostname.split('.').slice(-2).join('.');
    url.host = undefined;
    url.href = undefined;
    url.pathname = '/token';
    url.search = $.param({
      redirect_uri: window.location.href,
      login: true
    });
    window.location = Url.format(url);
  });
}

ReactDOM.render(<GraphiQL
fetcher={graphQLFetcher}/>, document.getElementById('main'));
