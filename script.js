define([
    'json!./manifest.json',
    'underscore',
    './js/views/settings.js',
    './js/helpers/render.js',
    './js/helpers/requester.js',
    './js/helpers/i18n.js'
  ],
  /**
   * @param {Object} manifest
   * @param {Object} manifest.widget
   * @param {String} manifest.widget.name
   * @param {String} manifest.widget.description
   * @param {String} manifest.widget.short_description
   * @param {String} manifest.widget.code
   * @param {String} manifest.widget.secret_key
   * @param {String} manifest.widget.version
   * @param {Array.<String>} manifest.widget.locale
   * @param {Boolean} manifest.widget.installation
   * @param {Number} manifest.widget.interface_version
   * @param {_} _
   * @param {SampleWidgetSettings} SampleWidgetSettings
   * @param {RenderClass} RenderClass
   * @param {RequesterClass} RequesterClass
   * @param {I18nClass} I18nClass
   * @return {Function}
   */
  function (manifest, _, SampleWidgetSettings, RenderClass, RequesterClass, I18nClass) {
    /**
     * @typedef {Object} WidgetSystemObject
     * @property {String} area
     * @property {Number} displayed_count
     * @property {Object} displayed_count_by_area
     * @property {Number|undefined} displayed_count_by_area.companies_card
     * @property {Number|undefined} displayed_count_by_area.contacts_card
     * @property {Number|undefined} displayed_count_by_area.leads_card
     * @property {Number|undefined} displayed_count_by_area.customers_card
     * @property {Number|undefined} displayed_count_by_area.contacts
     * @property {Number|undefined} displayed_count_by_area.leads
     * @property {Number|undefined} displayed_count_by_area.customers
     * @property {Number|undefined} displayed_count_by_area.dashboard
     * @property {Number|undefined} displayed_count_by_area.todo
     * @property {Number|undefined} displayed_count_by_area.widgetsSettings
     * @property {Number|undefined} displayed_count_by_area.info
     * @property {Number|undefined} displayed_count_by_area.card_sdk
     * @property {Number|undefined} displayed_count_by_area['leads-dp']
     * @property {Number|undefined} displayed_count_by_area['customers-dp']
     * @property {String} amouser
     * @property {String} amohash
     * @property {String} domain
     * @property {String} subdomain
     * @property {String} server
     */

    /**
     * @typedef {Object} AccountInfo
     * @property {Number} id
     * @property {String} name
     * @property {String} subdomain
     * @property {String} currency
     * @property {Number} paid_from
     * @property {Number} paid_till
     * @property {String} timezone
     * @property {String} date_pattern
     * @property {String} language
     * @property {String} date_format
     * @property {String} time_format
     * @property {String} country
     * @property {String} unsorted_on - Is unsorted turned on ("Y" or "N")
     * @property {Array.<{id:number,is_admin:string,login:string,name:string}>} users
     * @property {{path:string,widget_active:string,widget_code:string}} widget
     */

    /**
     * @typedef {Object} SelectedResult
     * @property {Array.<{id:number,emails:Array.<string>,phones:Array.<string>}>} selected
     * @property {Object} summary
     * @property {Number} summary.items
     * @property {Number} summary.emails
     * @property {Number} summary.phones
     */

    /**
     * @class Widget
     */
    /**
     * @member {function} crm_post - Post query to external server
     * @memberOf Widget
     * @param {String} host
     * @param {Object} [data={}]
     * @param {function} callback
     * @param {String} [type='text']
     */
    /**
     * @member {function} i18n - Get translation from i18n files
     * @memberOf Widget
     * @param {String} str_code
     * @return {String|boolean} - return false, when lang not found
     */
    /**
     * @member {function} get_settings - Get current widget settings
     * @memberOf Widget
     * @return {Object}
     */
    /**
     * @member {function} system
     * @memberOf Widget
     * @return {WidgetSystemObject}
     */
    /**
     * @member {function} add_action - add callback on system action
     * @memberOf Widget
     * @param {String} type - Type of action (phone or email)
     * @param {function} action - What to do on action
     */
    /**
     * @member {function} get_accounts_current
     * @memberOf Widget
     * @return {AccountInfo}
     */
    /**
     * @member {function} list_selected
     * @memberOf Widget
     * @return {SelectedResult|boolean} - return {SelectedResult} when current area is list
     */
    /**
     * @member {function} render
     * @memberOf Widget
     * @param {Object} data
     * @param {Object} params
     * @return {Boolean|String}
     */
    /**
     * @member {function} widgetsOverlay - Show overlay
     * @memberOf Widget
     */
    /**
     * @member {Object} helpers
     * @member {Modal} helpers.Modal - Modal class for create Modal
     * @memberOf Widget
     */

    /**
     * @class SampleWidgetController
     * @extends Widget
     */
    return function () {
      this.version = manifest.widget.version;
      //noinspection JSValidateTypes
      this._render = new RenderClass(this);
      //noinspection JSValidateTypes
      this._requester = new RequesterClass(this);
      //noinspection JSValidateTypes
      this._i18n = new I18nClass(this);

      this._settings = null;

      this.callbacks = {
        // Work with settings
        settings: _.bind(function ($modal_body) {
          //noinspection JSValidateTypes
          this._settings = new SampleWidgetSettings({
            render_object: this._render,
            requester: this._requester,
            i18n: this._i18n,
            $modal_body: $modal_body
          });
        }, this),

        /**
         * @param {Object} params
         * @param {Object} params.fields
         * @param {String} params.active - Is widget active now ('Y' || 'N')
         */
        onSave: _.bind(function (params) {
          var result = false;
          if (this._settings !== null) {
            result = this._settings.canSave(params.fields);
          }

          return result;
        }, this),


        init: _.bind(function () {
          console.log('init', arguments);
          return true;
        }, this),


        bind_actions: function () {
          console.log('bind_actions', arguments);
          return true;
        },


        render: function () {
          console.log('render', arguments);
          return true;
        },
        dpSettings: function () {
          console.log('dpSettings', arguments);
        },
        destroy: function () {
          console.log('destroy', arguments);
        },
        contacts: {
          selected: function () {
            console.log('selected', arguments);
          }
        },
        leads: {
          selected: function () {
            console.log('selected', arguments);
          }
        }
      };
      return this;
    };
  }
);
