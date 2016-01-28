import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import $ from 'jquery';
import Url from 'url';

window.$ = $;
let graphqlEndpoint = window.location.origin + '/graphql';
let params = {};
if (window.location.search) {
    $.extend(params, document.location.search.replace(/(^\?)/, '').split("&").map(function (n) {
        return n = n.split("="), this[n[0]] = n[1], this
    }.bind({}))[0])
}

function graphQLFetcher(graphQLParams) {
    let headers = {};

    headers['Content-Type'] = 'application/json';

    if (params.token) {
        headers['Authorization'] = `JWT ${params.token}`;
    }

    return fetch(graphqlEndpoint, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(graphQLParams)
    }).then(response => response.json());
}

if (!params.token) {
    graphQLFetcher({query: "query {root{url}} "}).then(function (json) {
        var url = Url.parse(json.data.root.url);
        url.hostname = url.hostname.split('.').slice(-2).join('.');
        url.host = undefined;
        url.href = undefined;
        url.pathname = '/token';
        url.search = $.param({ redirect_uri: window.location.href });
        window.location = Url.format(url);
    });

    // window.location('');
    //var api_key = prompt('Enter your Brandfolder API Key, or leave blank to access as a public user.');
    //if (api_key) {
    //    params.token         = token;
    //    window.location.search = `?${$.param(params)}`;
    //}
}

ReactDOM.render(<GraphiQL
    fetcher={graphQLFetcher}/>, document.getElementById('main'));
