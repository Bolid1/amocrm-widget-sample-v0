define(['underscore'],
  /**
   * @param {UnderscoreStatic} _
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
        get: function (param) {
          var result = null;
          if (!param) {
            return result;
          }

          switch (param) {
            case 'base_path':
              result = this._widget.get_settings().path;
              break;
            case 'styles_path':
              result = this.get('base_path') + '/css';
              break;
            case 'widget_code':
              result = this._widget.get_settings().widget_code;
              break;
            case 'widget_version':
              result = this._widget.version;
              break;
          }

          return result;
        },

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

        renderPromise: function (template_name, params) {
          return new Promise(_.bind(function (resolve) {
            this.render(template_name, function (template, params) {
              resolve({template: template, params: params});
            }, params);
          }, this));
        },

        _getTemplate: function (template_name, params, callback) {
          (typeof params === 'object') || (params = {});
          template_name = template_name || '';

          var onLoadTemplate = _.bind(function (template) {
            TemplatesCache[template_name] = template;
            this.initCallBack(template, callback);
          }, this);

          if (TemplatesCache[template_name]) {
            onLoadTemplate(TemplatesCache[template_name]);
            return;
          }

          this._widget.render({
            href: '/templates/' + template_name + '.twig',
            base_path: this.get('base_path'),
            v: +new Date,
            load: onLoadTemplate
          }, params);
        },

        renderCore: function (template_name, callback, params) {
          var mockTemplate = {
            render: _.bind(function (render_params) {
              return this._widget.render(_.extend({ref: template_name}, params), render_params);
            }, this)
          };

          this.initCallBack(mockTemplate, callback);
        },

        renderCoreControl: function (control_name, callback, params) {
          return this.renderCore('/tmpl/controls/' + control_name + '.twig', callback, params);
        },

        initCallBack: function (template, callback) {
          if (callback && _.isFunction(callback)) {
            callback(template, {
              widget_code: this.get('widget_code'),
              current_date: (+new Date),
              widget_version: this.get('widget_version'),
              base_path: this.get('base_path'),
              styles_path: this.get('styles_path')
            });
          }
        }
      }
    );

    return Render;
  }
);
