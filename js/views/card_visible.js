define(['underscore', './base_view.js'],
  /**
   * @param {_} _
   * @param {SampleWidgetBaseView} BaseView
   * @return {SampleWidgetCardVisible}
   */
  function (_, BaseView) {
    return BaseView.extend(
      /**
       * @class SampleWidgetCardVisible
       * @extends SampleWidgetBaseView
       * @description Работа в карточках с визуальным отображением
       */
      {
        /**
         * @member {String}
         */
        _element_type: null,

        /**
         * @param {Object} params
         * @param {jQuery} params.el
         * @param {RenderClass} params.render_object
         * @param {I18nClass} params.i18n
         * @param {String} params.element_type (leads or
         * @constructor
         */
        initialize: function (params) {
          BaseView.prototype.initialize.apply(this, arguments);
          this._element_type = params.element_type;

          this.render();
        },

        /**
         * @methodOf SampleWidgetCardVisible
         * @this SampleWidgetCardVisible
         * @return {SampleWidgetCardVisible}
         */
        render: function () {
          var template = 'cards/' + this._element_type;
          this._render_object.render(template, _.bind(this._render, this));
          return this;
        },

        _render: function (template, params) {
          this.$el.html(template.render(params));
        }
      }
    );
  });
