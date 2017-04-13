define(['backbone'],
  /**
   * @param {Backbone} Backbone
   * @param {Backbone.View} Backbone.View
   * @return {SampleWidgetBaseView}
   */
  function (Backbone) {
    return Backbone.View.extend(
      /**
       * @class SampleWidgetBaseView
       * @extends {Backbone.View}
       * @description Базовая вьюшка виджета. Содержит описание Backbone.View
       */
      {
        /**
         * @member {jQuery}
         */
        $el: null,

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
         * @param {Object} params
         * @param {jQuery} params.el
         * @param {RenderClass} params.render_object
         * @param {I18nClass} params.i18n
         * @constructor
         */
        initialize: function (params) {
          this._render_object = params.render_object;
          this._i18n = params.i18n;
          this._$save_btn = this.$el.find('.js-widget-save');
        }

        /**
         * @description Remove this view by taking the element
         * out of the DOM, and
         * removing any applicable Backbone.Events listeners.
         * @method remove
         * @methodOf SampleWidgetBaseView
         * @instance
         */
      }
    );
  }
);

