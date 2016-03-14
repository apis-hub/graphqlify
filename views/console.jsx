import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import $ from 'jquery';
import Url from 'url';
import 'jquery.cookie';
import swal from 'sweetalert';

let graphqlEndpoint = window.location.origin + '/graphql';
let params = {};

function parseParams(search) {
  let p = {};
  if (search) {
    $.extend(p, search.replace(/(^\?)/, '').split('&').map(function (n) {
      let kv = n.split('=');
      p[kv[0]] = kv[1] === undefined ? true : kv[1];
    }));
  }
  return p;
}

if (window.location.search) {
  params = parseParams(window.location.search);
}

const authorize = function (login) {
  graphQLFetcher({
    query: 'query {api{url}}'
  }).then(function (json) {
    let url = Url.parse(json.data.api.url);
    url.hostname = url.hostname.split('.').slice(-2).join('.');
    url.host = undefined;
    url.href = undefined;
    url.pathname = '/token';
    url.search = $.param({
      redirect_uri: window.location.href,
      login: Boolean(login),
      private: true
    });
    window.location = Url.format(url);
  });
};

const reset = function () {
  $.removeCookie('token');
  window.location = '/';
};

function graphQLFetcher(graphQLParams) {
  let headers = {};

  headers['Content-Type'] = 'application/json';

  if ($.cookie('token')) {
    headers['Authorization'] = `JWT ${$.cookie('token')}`;
  }

  return fetch(graphqlEndpoint, {
    method: 'post',
    headers,
    body: JSON.stringify(graphQLParams)
  }).then(response => {
    if ([ 412, 419 ].indexOf(response.status) >= 0) {
      reset();
    } else if (response.status === 401) {
      swal({
        title: 'Request requires token!',
        text: 'This query requires a valid user token, should we fetch one now?',
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Continue Unauthorized',
        confirmButtonColor: '#59e287',
        confirmButtonText: 'Fetch Token',
        closeOnConfirm: false
      }, function () {
        authorize(true);
      });
    }
    return response;
  }).then(response => response.json);
}

if (params.token) {
  $.cookie('token', params.token, {
    expires: 1
  });
  window.location = '/';
}

function renderTokenStatus() {
  if ($.cookie('token')) {
    return (
      <span>
        Using token: <span style={{
          color: '#40d1f5'
        }}>
        {$.cookie('token')}</span> <a style={{
          color: '#efe860',
          cursor: 'pointer'
        }} onClick={reset}>
        (reset)
      </a>
      </span>
    );
  }
  return (
    <span>
      Not Authorized: <a style={{
        color: '#59e287',
        cursor: 'pointer'
      }} onClick={authorize.bind(this, true)}>
      Get User Token
    </a> or <a style={{
      color: '#59e287',
      cursor: 'pointer'
    }} onClick={authorize.bind(this, false)}>Get Public Token</a>
    </span>
  );
}

ReactDOM.render(
  <div id='container'>
    <header style={{
      padding: '5px',
      backgroundColor: '#384650',
      color: '#fff'
    }}>
    {renderTokenStatus()}
    <div style={{
      clear: 'both'
    }} />
    </header>
    <GraphiQL
  fetcher={graphQLFetcher}/>
  </div>
  , document.getElementById('main'));

if (parseParams(Url.parse(document.referrer).search).token) {
  $('.execute-button').click();
}
