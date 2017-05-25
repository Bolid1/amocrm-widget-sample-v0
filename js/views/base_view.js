define(['backbone', 'jquery', './../helpers/container.js'],
  /**
   * @param {Backbone} Backbone
   * @param {Backbone.View} Backbone.View
   * @param {JQuery} $
   * @param {Container} Container
   * @return {SampleWidgetBaseView}
   */
  function (Backbone, $, Container) {
    return Backbone.View.extend(
      /**
       * @class SampleWidgetBaseView
       * @extends {Backbone.View}
       * @description Базовая вьюшка виджета. Содержит описание Backbone.View
       */
      {
        /**
         * @member {JQuery}
         */
        $el: null,

        /**
         * @member {JQuery}
         */
        _$document: null,

        /**
         * @member {Node}
         */
        el: null,

        /**
         * @member {RenderClass}
         */
        _render_object: null,

        /**
         * @member {I18nClass}
         */
        _i18n: null,

        /**
         * @member {String}
         */
        _ns: '',

        /**
         * @member {String}
         */
        _wc: '',

        /**
         * @param {Object} params
         * @param {JQuery} params.el
         * @param {RenderClass} params.render_object
         * @param {I18nClass} params.i18n
         * @param {String} params.ns
         * @param {String} params.wc
         * @constructor
         */
        initialize: function (params) {
          this._render_object = params.render_object;
          this._i18n = params.i18n;
          this._$save_btn = this.$el.find('.js-widget-save');
          this._$document = $(document);
          this._ns = params.ns;
          this._wc = params.wc;
        },

        /**
         * @description Remove this view by taking the element
         * out of the DOM, and
         * removing any applicable Backbone.Events listeners.
         * @method remove
         * @methodOf SampleWidgetBaseView
         * @instance
         */

        /**
         * @param file
         */
        appendStyles: function (file) {
          $('<link/>', {
            href: this._render_object.get('styles_path') + '/' + file + '.css',
            rel: 'stylesheet'
          }).appendTo(this.$el);
        },

        remove: function () {
          this._$document.off(this._ns);

          return Backbone.View.prototype.remove.apply(this, arguments);
        }
      }
    );
  }
);

