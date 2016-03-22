import 'jquery.cookie';

import $ from 'jquery';
import fetch from 'isomorphic-fetch';
import swal from 'sweetalert';
import GraphiQL from 'graphiql';
import React from 'react';
import Url from 'url';

import LoginModal from './LoginModal';

export default class Console extends React.Component {

  static childContextTypes = {
    fetcher: React.PropTypes.func.isRequired
  };

  getChildContext() {
    return { fetcher: this.fetcher.bind(this) }
  }

  constructor(...args) {
    super(...args);
    this.state = {
      token: $.cookie('token'),
      privateApi: $.cookie('private-api'),
      activeModal: undefined
    };
  }

  componentDidMount() {
    let component = this;
    require('konami-komando')({
      once: false,
      useCapture: true,
      callback: () => {
        component.setState({ privateApi: true, token: undefined });
      }
    });
  }

  componentDidUpdate() {
    let newCookies = {};
    newCookies['token'] = this.state.token;
    newCookies['private-api'] = this.state.privateApi;
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
        login: Boolean(login),
        private: true
      });
      window.location = Url.format(url);
    });
  }

  reset() {
    this.setState({ token: undefined, privateApi: undefined });
  }

  renderToken() {
    let tokenStyle = { color: '#40d1f5' };
    let resetStyle = { color: '#efe860', cursor: 'pointer' };
    return (
      <span>
        Using token:&nbsp;
        <span style={tokenStyle}>{this.state.token}</span>
        &nbsp;
        <a style={resetStyle} onClick={this.reset.bind(this)}>(reset)</a>
      </span>
    );
  }

  showModal(element) {
    let outerCloseFn = this.setState.bind(this, { activeModal: undefined });
    let closeFn = () => outerCloseFn();
    return () => {
      let modalProps = {
        show: true,
        onHide: closeFn,
        close: closeFn,
        closeWithDelay: () => setTimeout(closeFn, 1000)
      };
      let modalElement = React.cloneElement(element, modalProps);
      this.setState({ activeModal: modalElement });
    };
  }

  renderUnauthorized() {
    let loginTokenFn = this.authorize.bind(this, true);
    let basicTokenFn = this.authorize.bind(this, false);
    let linkStyle = { color: '#59e287', cursor: 'pointer' };
    if (this.state.privateApi) {
      return (
        <span>
          Not Authorized:&nbsp;
          <a style={linkStyle} onClick={this.showModal(<LoginModal />)}>Login To Brandfolder</a>
        </span>
      );
    }
    return (
      <span>
        Not Authorized:&nbsp;
        <a style={linkStyle} onClick={loginTokenFn}>Get User Token</a>
        &nbsp;or&nbsp;
        <a style={linkStyle} onClick={basicTokenFn}>Get Public Token</a>
      </span>
    );
  }

  renderPrivateStatus() {
    let removePrivate = () => this.setState({
      privateApi: undefined,
      token: undefined
    });
    let privateStyle = {
      float: 'right',
      color: 'red',
      cursor: 'pointer'
    };
    if (this.state.privateApi) {
      return (
        <span style={privateStyle} onClick={removePrivate}>
          PRIVATE API
        </span>
      );
    }
  }

  renderTokenStatus() {
    return this.state.token ? this.renderToken() : this.renderUnauthorized();
  }

  promptForToken() {
    swal({
      title: 'Request requires token!',
      text: 'This query requires a valid user token, fetch one now?',
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Continue Unauthorized',
      confirmButtonColor: '#59e287',
      confirmButtonText: 'Fetch Token',
      closeOnConfirm: false
    }, this.authorize.bind(this, true));
  }

  fetcher(graphQLParams) {
    let component = this;
    let graphqlEndpoint = window.location.origin + '/graphql';
    let headers = {};

    headers['Content-Type'] = 'application/json';

    if (this.state.privateApi) {
      headers['x-api-private'] = true;
    }

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
      <div id='container'>
        {this.state.activeModal}
        <header style={{
          padding: '5px',
          minHeight: '30px',
          fontSize: '1.1em',
          backgroundColor: '#384650',
          color: '#fff',
          fontFamily: 'monospace'
        }}>
        {this.renderTokenStatus()}
        {this.renderPrivateStatus()}
        <div style={{ clear: 'both' }} />
        </header>
        <GraphiQL fetcher={this.fetcher.bind(this)}/>
      </div>
    );
  }
}
