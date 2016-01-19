import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import $ from 'jquery';

window.$ = $;
let params = {};
if (window.location.search){
    $.extend(params, document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0])
}
if(!params.api_key) {
    var api_key = prompt('Enter your Brandfolder API Key, or leave blank to access as a public user.');
    if (api_key) {
        params.api_key         = api_key;
        window.location.search = `?${$.param(params)}`;
    }
}

function graphQLFetcher(graphQLParams) {
    let headers = {};

    headers['Content-Type'] = 'application/json';

    if(params.api_key){
        headers['Authorization'] = `JWT ${params.api_key}`;
    }

    return fetch(window.location.origin + '/graphql', {
        method: 'post',
        headers: headers,
        body: JSON.stringify(graphQLParams)
    }).then(response => response.json());
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher} />, document.getElementById('main'));