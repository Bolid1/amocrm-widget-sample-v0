define([
    './helpers/container.js',

    './helpers/render.js',
    './helpers/requester.js',
    './helpers/i18n.js',
    './helpers/logger.js',

    './factories/card_views.js',

    './views/settings.js',
    './views/leads_list.js'
  ],
  /**
   * @param Container
   * @param Render
   * @param Requester
   * @param I18n
   * @param Logger
   * @param FactoryCardView
   * @param SettingsView
   * @param LeadsListView
   * @return {Function}
   */
  function (Container, Render, Requester, I18n, Logger, FactoryCardView, SettingsView, LeadsListView) {
    return function (WidgetObject) {
      Container.set('widget', function () {
        return WidgetObject;
      });

      // Tools
      Container.set('render', function (c) {
        return new Render(c.getWidget());
      });

      Container.set('requester', function (c) {
        return new Requester(c.getWidget());
      });

      Container.set('i18n', function (c) {
        return new I18n(c.getWidget());
      });

      Container.set('logger', function (c) {
        return new Logger(c.getWidget());
      });

      // Views
      Container.factory('settings', function (c, $modal_body) {
        return new SettingsView({
          render_object: c.get('render'),
          requester: c.get('requester'),
          i18n: c.get('i18n'),
          el: $modal_body,
          ns: c.getWidget().ns,
          wc: c.getWidget().code
        });
      });

      Container.factory('modal', function (c, params) {
        var Modal = this.getWidget().helpers.Modal;
        params = _.extend({
          class_name: c.getWidget().code + '-modal sample_widget',
          init: _.noop,
          destroy: _.noop
        }, params);

        return new Modal(params);
      });

      Container.factory('leads_list', function (c, ids) {
        return new LeadsListView({
          render_object: c.get('render'),
          requester: c.get('requester'),
          i18n: c.get('i18n'),
          ids: ids,
          ns: c.getWidget().ns,
          wc: c.getWidget().code
        });
      });


      Container.factory('card_view', function (c, element_type) {
        return FactoryCardView(element_type, {
          el: $('.js-widget-' + c.getWidget().code + '-body'),
          element_type: element_type,
          render_object: c.get('render'),
          i18n: c.get('i18n'),
          ns: c.getWidget().ns,
          wc: c.getWidget().code
        });
      });
    };
  }
);
