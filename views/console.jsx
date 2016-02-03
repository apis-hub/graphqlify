import ReactDOM from "react-dom";
import GraphiQL from 'graphiql';
import fetch from "isomorphic-fetch";
import $ from "jquery";
import Url from "url";
import "jquery.cookie";
import swal from "sweetalert";

window.$ = $;
let graphqlEndpoint = window.location.origin + '/graphql';
let params = {};

function parseParams(search) {
  let params = {};
  if (search) {
    $.extend(params, search.replace(/(^\?)/, '').split("&").map(function(n) {
      var kv = n.split("=");
      params[kv[0]] = kv[1] === undefined ? true : kv[1];
    }))
  }
  return params
}

if (window.location.search) {
  params = parseParams(window.location.search)
}

function authorize() {
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
  }).then((response) => {
    if ([401, 412, 419].indexOf(response.status) >= 0) {
      swal({
        title: "Request requires token!",
        text: "This query requires a valid user token, should we fetch one now?",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "Continue Unauthorized",
        confirmButtonColor: "#59e287",
        confirmButtonText: "Fetch Token",
        closeOnConfirm: false
      }, function() {
        authorize()
      });
    }
    return response
  }).then(response => response.json());
}

if (params.token) {
  $.cookie('token', params.token, {
    expires: 1
  });
  window.location = '/';
} else if (params.reset) {
  $.removeCookie('token');
  window.location = '/';
}

ReactDOM.render(<GraphiQL
fetcher={graphQLFetcher}/>, document.getElementById('main'));

if ($.cookie('token')) {
  $('#token').html(`Using token: <span style="color: #40d1f5">${$.cookie('token')}</span> <a style="color:#efe860" href="/?reset">(reset)</a>`)
} else {
  $('#token').hide()
}

if (parseParams(Url.parse(document.referrer).search).token) {
  $('.execute-button').click()
}
