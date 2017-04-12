define(['underscore', 'backbone'],
  /**
   * @param {_} _
   * @param {Backbone} Backbone
   * @return {SampleWidgetSettings}
   */
  function (_, Backbone) {
    return Backbone.View.extend(
      /**
       * @class SampleWidgetSettings
       * @extends {Backbone.View}
       * @description Работа в окне настроек
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
         * @param {Boolean} is_active
         * @param {Object} fields
         * @param {String} fields.field_text
         * @param {String} fields.field_pass
         * @param {Object|undefined} [fields.field_custom]
         *
         * @return {boolean}
         */
        canSave: function (is_active, fields) {
          var data, hash, params, first_install;

          // Compose data to check & save
          data = {
            login: fields.field_text,
            password: fields.field_pass
          };

          hash = this._buildHash(data.login, data.password);

          // Compose ajax params
          params = {
            data: data,
            success: _.bind(this._onCheckPassword, this),
            error: _.bind(this.stopSave, this)
          };

          // Is widget already was installed in this account
          first_install = this._$modal_body.find('input[name="widget_active"]').length === 0;

          // If widget was already installed, and user turn it of,
          // then we don't check any data,
          // just let him do what he want
          if (!first_install && !is_active) {
            return true;
          }

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
