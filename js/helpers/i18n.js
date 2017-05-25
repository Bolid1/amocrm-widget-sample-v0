define(['underscore'],
  /**
   * @param {UnderscoreStatic} _
   * @return {I18nClass}
   */
  function (_) {
    var I18n;

    /**
     * @class I18nClass
     * @param {SampleWidgetController} widget
     * @return {I18nClass}
     * @constructor
     */
    I18n = function (widget) {
      this._widget = widget;
      return this;
    };

    _.extend(I18n.prototype,
      /**
       * @lends {I18nClass.prototype}
       * @this {I18nClass}
       */
      {
        get: function (message) {
          return this._widget.i18n(message) || message;
        }
      }
    );

    return I18n;
  }
);
