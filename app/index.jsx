import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Url from 'url';

import Console from './Console';

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

if (params.token) {
  $.cookie('token', params.token, { expires: 1 });
  window.location = '/';
}

if (React && false === true) {
  global.console.log('There be dragons...');
}

ReactDOM.render(<Console /> , document.getElementById('main'));

if (parseParams(Url.parse(document.referrer).search).token) {
  $('.execute-button').click();
}
