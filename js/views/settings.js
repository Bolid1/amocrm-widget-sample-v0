define(['underscore', 'backbone'],
  /**
   * @param {_} _
   * @param {Backbone} Backbone
   * @return {SampleWidgetSettings}
   */
  function (_, Backbone) {
    /**
     * @class SampleWidgetSettings
     * @description Работа в окне настроек
     * @constructor
     */
    return Backbone.View.extend(
      /**
       * @lends {SampleWidgetSettings}
       * @this {SampleWidgetSettings}
       */
      {
        /**
         * @member {jQuery}
         */
        _$modal_body: null,

        /**
         * @member {jQuery}
         */
        _$save_btn: null,

        /**
         * @member {RenderClass}
         */
        _render_object: null,

        /**
         * @member {RequesterClass}
         */
        _requester: null,

        /**
         * @member {I18nClass}
         */
        _i18n: null,

        /**
         * @member {Object}
         */
        _last_hash: {},

        /**
         * @param {Object} params
         * @param {jQuery} params.$modal_body
         * @param {RenderClass} params.render_object
         * @param {RequesterClass} params.requester
         * @param {I18nClass} params.i18n
         * @constructor
         */
        initialize: function (params) {
          this._render_object = params.render_object;
          this._requester = params.requester;
          this._i18n = params.i18n;
          this._$modal_body = params.$modal_body;
          this._$save_btn = this._$modal_body.find('.js-widget-save');
        },

        /**
         * @param {Object} fields
         * @param {String} fields.field_text
         * @param {String} fields.field_pass
         * @param {Object|undefined} [fields.field_custom]
         *
         * @return {boolean}
         */
        canSave: function (fields) {
          var data = {
            login: fields.field_text,
            password: fields.field_pass
          };

          var hash = this._buildHash(data.login, data.password);

          var params = {
            data: data,
            success: _.bind(this._onCheckPassword, this),
            error: _.bind(this.stopSave, this)
          };

          if (!_.has(fields, 'field_custom')) {
            fields.field_custom = {};
          }

          if (!this._last_hash[hash]) {
            this._requester.send(params, 'check_password');
            return false;
          }

          fields.field_custom[hash] = this._last_hash[hash];

          return true;
        },

        _buildHash: function (login, password) {
          return login + '_' + password;
        },

        stopSave: function () {
          this._$save_btn.trigger('button:load:stop');
        },

        /**
         * @param {Object} hash
         */
        save: function (hash) {
          this._last_hash = hash;
          this._$save_btn.click();
        },

        showTip: function () {
          this._render_object.render('settings/tip', _.bind(this._showTip, this));
        },

        /**
         * @param {Twig.Template} template
         * @param {Object} params
         * @private
         */
        _showTip: function (template, params) {
          var tip = template.render(_.extend(params, {message: this._i18n.get('settings.tips.equals')}));
          var $tip = $(tip);

          this._$modal_body.find('.widget_settings_block__descr').append($tip);
          _.delay(function () {
            $tip.remove();
          }, 1000);
        },

        /**
         * @description Check server response and save
         *
         * @param {Object} response
         * @param {String} response.status
         * @param {Object} response.hash
         * @private
         */
        _onCheckPassword: function (response) {
          if (response && response.status === 'success' && response.hash) {
            this.save(response.hash);
          } else {
            this.showTip();
            this.stopSave();
          }
        }
      }
    );
  }
);
