define(['underscore', './base_view.js'],
  /**
   * @param {UnderscoreStatic} _
   * @param {SampleWidgetBaseView} BaseView
   * @return {SampleWidgetSettings}
   */
  function (_, BaseView) {
    return BaseView.extend(
      /**
       * @class SampleWidgetSettings
       * @extends SampleWidgetBaseView
       * @description Работа в окне настроек
       * @this SampleWidgetSettings
       */
      {
        /**
         * @member {JQuery}
         */
        _$save_btn: null,

        /**
         * @member {JQuery}
         */
        _$confirm: null,

        /**
         * @member {RequesterClass}
         */
        _requester: null,

        /**
         * @member {Object}
         */
        _last_hash: {},

        /**
         * @param {Object} params
         * @param {JQuery} params.el
         * @param {RenderClass} params.render_object
         * @param {RequesterClass} params.requester
         * @param {I18nClass} params.i18n
         * @constructor
         */
        initialize: function (params) {
          BaseView.prototype.initialize.apply(this, arguments);
          this._ns += ':settings';
          this._requester = params.requester;
          this._$save_btn = this.$el.find('.js-widget-save');
          this.renderConfirm();
          this.appendStyles('base');
          this._$document.on('widget:' + this._wc + ':installed' + this._ns, function () {
            this.remove();
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction,AmdModulesDependencies
            AMOCRM.widgets.clear_cache();
          }.bind(this));
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
          first_install = this._isFirstInstall();

          // If widget was already installed, and user turn it of,
          // then we don't check any data,
          // just let him do what he want
          if (!first_install && !is_active) {
            return true;
          }

          if (!this._isConfirmed()) {
            this.stopSave().showNeedConfirm();
            return false;
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

        /**
         * @return {boolean}
         * @private
         * @description Check if widget was NOT installed in prev time
         */
        _isFirstInstall: function () {
          return this.$el.find('input[name="widget_active"]').length === 0;
        },

        /**
         * @return {boolean}
         * @private
         * @description Check if widget was NOT installed in prev time
         */
        _isActive: function () {
          return !this._isFirstInstall() && this.$el.find('input[name="widget_active"]').get(0).checked === true;
        },

        /**
         * @param {String} login
         * @param {String} password
         * @return {String}
         * @private
         */
        _buildHash: function (login, password) {
          return login + '_' + password;
        },

        stopSave: function () {
          this._$save_btn.trigger('button:load:stop');

          return this;
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
         * @param {Template} template
         * @param {Object} params
         * @param {String} params.widget_code
         * @param {Number} params.current_date
         * @param {String} params.widget_version
         * @param {String} params.base_path
         * @private
         */
        _showTip: function (template, params) {
          var tip = template.render(_.extend(params, {message: this._i18n.get('settings.tips.equals')}));
          var $tip = $(tip);

          this.$el.find('.widget_settings_block__descr').append($tip);
          _.delay(function () {
            $tip.remove();
          }, 1000);
        },

        showNeedConfirm: function () {
          this._render_object.render('settings/tip', _.bind(this._showNeedConfirm, this));
        },

        /**
         * @param {Template} template
         * @param {Object} params
         * @param {String} params.widget_code
         * @param {Number} params.current_date
         * @param {String} params.widget_version
         * @param {String} params.base_path
         * @private
         */
        _showNeedConfirm: function (template, params) {
          var tip = template.render(_.extend(params, {message: this._i18n.get('settings.tips.need_confirm')}));
          var $tip = $(tip);

          this.$el.find('.widget_settings_block__descr').append($tip);
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
        },

        renderConfirm: function () {
          this._render_object.renderCoreControl('checkbox', _.bind(this._renderConfirm, this));

          return this;
        },

        /**
         * @param {Template} template
         * @private
         */
        _renderConfirm: function (template) {
          var html = template.render({
            class_name: 'js-agreement send_auth_agreement',
            input_class_name: 'js-agreement-input',
            checked: this._isActive(),
            text_class_name: 'agreement_text',
            text: this._i18n.get('settings.agreement')
          });

          this.$el.find('.widget_settings_block__fields').append(html);
          this._$confirm = this.$el.find('.js-agreement-input');
        },

        _isConfirmed: function () {
          return this._$confirm && this._$confirm.get(0).checked === true;
        },

        appendStyles: function (file) {
          return BaseView.prototype.appendStyles.call(this, 'settings/' + file);
        }
      }
    );
  }
);
