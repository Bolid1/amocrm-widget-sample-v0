define(['underscore', 'jquery'], function (_, $) {
  'use strict';

  var Requester;

  /**
   * @class RequesterClass
   * @param widget
   * @return {RequesterClass}
   * @constructor
   */
  Requester = function (widget) {
    this._widget = widget;

    return this;
  };

  _.extend(Requester.prototype,
    /**
     * @lends {RequesterClass.prototype}
     * @this {RequesterClass}
     */
    {
      default_params: {
        method: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        async: true,
        crossDomain: false,
        accepts: {
          json: 'application/json'
        }
      },

      _getParam: function (param) {
        var result = null;
        var system = this._widget.system();
        var settings = this._widget.get_settings();

        if ((typeof param).toLowerCase() !== 'string') {
          return result;
        }

        switch (param) {
          case 'domain':
          case 'subdomain':
            result = system[param];
            break;
          case 'user':
          case 'hash':
            result = system['amo' + param];
            break;
          case 'widget_code':
            result = settings[param];
            break;
        }

        return result;
      },

      buildUrl: function (endpoint, data) {
        var base_url, auth;

        base_url = '//' + this._getParam('domain') + '/widgets/';
        base_url += this._getParam('subdomain') + '/loader/';
        base_url += this._getParam('widget_code') + '/';

        auth = '?amouser=' + this._getParam('user') + '&amohash=' + this._getParam('hash');

        data.action || (data.action = endpoint);

        return base_url + endpoint + auth + '&action=' + data.action;
      },

      get: function (params, endpoint) {
        params || (params = {});
        params.method = 'GET';

        return this.send(params, endpoint);
      },

      /**
       * @param {Object} params
       * @param {String} [params.action]
       * @param {String} [params.url]
       * @param {String} [params.method]
       * @param {Object} [params.data]
       * @param {String} [endpoint='proxy'] - endpoint type (direct or proxy)
       * @return {*}
       */
      send: function (params, endpoint) {
        var result_params;
        var accounts_current = this._widget.get_accounts_current();

        params || (params = {});
        endpoint = endpoint || 'proxy';

        params.data || (params.data = {});
        if (accounts_current && accounts_current.account) {
          params.data.account = accounts_current.account;
        }

        var auto_params = {
          url: endpoint === 'proxy' ? params.url : this.buildUrl(endpoint, params.data)
        };

        if (params.method === 'GET') {
          auto_params['contentType'] = '';
        }

        result_params = _.extend({}, this.default_params, params, auto_params);

        return endpoint !== 'proxy' ? $.ajax(result_params) : this._crmPost(params, result_params);
      },

      _crmPost: function (params, result_params) {
        this._widget.crm_post(params.url, params.data, params.success, result_params.contentType);

        return null;
      }
    }
  );

  return Requester;
});
