import 'jquery.cookie';

import $ from 'jquery';
import fetch from 'isomorphic-fetch';
import GraphiQL from 'graphiql';
import React from 'react';
import Url from 'url';

import LoginModal from './LoginModal';

export default class Console extends React.Component {

  static childContextTypes = {
    fetcher: React.PropTypes.func.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    setToken: React.PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      fetcher: this.fetcher.bind(this),
      closeModal: this.closeModal.bind(this),
      setToken: this.setToken.bind(this)
    };
  }

  constructor(...args) {
    super(...args);
    this.state = {
      token: $.cookie('token'),
      activeModal: undefined
    };
  }

  componentDidUpdate() {
    let newCookies = {};
    newCookies['token'] = this.state.token;
    Object.keys(newCookies).forEach(key => {
      let val = newCookies[key];
      if (val !== undefined) {
        $.cookie(key, val);
      } else {
        $.removeCookie(key);
      }
    });
  }

  authorize(login) {
    this.fetcher({
      query: 'query {api{url}}'
    }).then(function (json) {
      let url = Url.parse(json.data.api.url);
      url.hostname = url.hostname.split('.').slice(-2).join('.');
      url.host = undefined;
      url.href = undefined;
      url.pathname = '/token';
      url.search = $.param({
        redirect_uri: window.location.href,
        login: Boolean(login)
      });
      window.location = Url.format(url);
    });
  }

  reset() {
    this.setState({ token: undefined, privateApi: undefined });
  }

  renderToken() {
    let tokenStyle =
      { color: '#40d1f5', wordWrap: 'break-word', width: '500px' };
    let resetStyle =
      { color: '#ff0000', cursor: 'pointer' };
    return (
      <div>
        Using token:&nbsp;
        <a style={resetStyle} onClick={this.reset.bind(this)}>(reset)</a>
        <br />
        <div style={tokenStyle}>{this.state.token}</div>
        &nbsp;
      </div>
    );
  }

  setToken(token) {
    this.setState({ token });
  }

  showModal(element) {
    return () => {
      this.setState({ activeModal: element });
    };
  }

  closeModal() {
    this.setState({ activeModal: undefined });
  }

  renderUnauthorized() {
    let linkStyle = { color: '#59e287', cursor: 'pointer' };

    return (
      <span>
        Not Authorized:&nbsp;
        <a
          style={linkStyle}
          onClick={this.showModal(<LoginModal />)}
        >
          Login To Brandfolder
        </a>
      </span>
    );
  }

  renderTokenStatus() {
    return this.state.token ? this.renderToken() : this.renderUnauthorized();
  }

  fetcher(graphQLParams) {
    let component = this;
    let graphqlEndpoint = window.location.origin + '/graphql';
    let headers = {};

    headers['Content-Type'] = 'application/json';

    if (this.state.token) {
      headers['Authorization'] = `JWT ${this.state.token}`;
    }

    return fetch(graphqlEndpoint, {
      method: 'post',
      headers,
      body: JSON.stringify(graphQLParams)
    }).then(response => {
      if ([ 412, 419 ].indexOf(response.status) >= 0) {
        component.reset();
      } else if (response.status === 401) {
        component.promptToken();
      }
      return response;
    }).then(response => response.json());
  }

  render() {
    return (
        <GraphiQL fetcher={this.fetcher.bind(this)}>
          <GraphiQL.Logo>
            Brandfolder GraphQL Console
          </GraphiQL.Logo>
          <GraphiQL.Footer>
            {this.state.activeModal}
            <div style={{ padding: '10px' }}>
              {this.renderTokenStatus()}
            </div>
          </GraphiQL.Footer>
        </GraphiQL>
    );
  }
}
