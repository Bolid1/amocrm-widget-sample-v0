define(['underscore'],
  /**
   * @param {_} _
   * @return {Render}
   */
  function (_) {
    var Render;
    var TemplatesCache = {};

    /**
     * @class RenderClass
     * @param {SampleWidgetController} widget
     * @return {RenderClass}
     * @constructor
     */
    Render = function (widget) {
      this._widget = widget;
      return this;
    };

    _.extend(Render.prototype,
      /**
       * @lends {RenderClass.prototype}
       * @this {RenderClass}
       */
      {
        render: function (template_name, callback, params, ctx) {
          if (!template_name) {
            return false;
          }
          if (!(callback && _.isFunction(callback))) {
            return false;
          }
          params || (params = {});
          ctx || (ctx = null);

          this._getTemplate(template_name, {}, function (template, base_params) {
            callback.call(ctx, template, _.extend({}, base_params, params));
          })
        },

        _getTemplate: function (template_name, params, callback) {
          (typeof params === 'object') || (params = {});
          template_name = template_name || '';

          var onLoadTemplate = _.bind(function (template) {
            TemplatesCache[template_name] = template;
            if (callback && _.isFunction(callback)) {
              callback(template, {
                widget_code: this._widget.get_settings().widget_code,
                current_date: (+new Date),
                widget_version: this._widget.version,
                base_path: this._widget.get_settings().path
              });
            }
          }, this);

          if (TemplatesCache[template_name]) {
            onLoadTemplate(TemplatesCache[template_name]);
            return;
          }

          this._widget.render({
            href: '/templates/' + template_name + '.twig',
            base_path: this._widget.get_settings().path,
            v: +new Date,
            load: onLoadTemplate
          }, params);
        },

        renderCore: function (template_name, options) {
          return this._widget.render({ref: template_name}, options);
        }
      }
    );

    return Render;
  }
);
