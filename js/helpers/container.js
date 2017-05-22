(define(['underscore'], function (_) {
  var objects = {};
  var factories = [];

  /**
   * @type {Object}
   */
  var Container = {};

  /**
   * @methodOf Container
   * @param {String} key
   * @return {*}
   */
  Container.get = function (key) {
    var isFactory = factories.indexOf(key) !== -1;

    if (!objects[key]) {
      throw new Error('Object "%s" not found'.replace('%s', key))
    }

    if (!isFactory && typeof objects[key] === 'function') {
      objects[key] = objects[key](Container);
    }

    if (isFactory) {
      return factory(objects[key], _(arguments).slice(1));
    }

    return objects[key];
  };

  function factory(obj, args) {
    args.unshift(Container);
    return obj.apply(Container, args);
  }

  /**
   * @methodOf Container
   * @param {String} key
   * @param {*} value
   * @return void
   */
  Container.set = function (key, value) {
    objects[key] = value;
  };

  /**
   * @methodOf Container
   * @param {String} key
   * @param {*} value
   * @return void
   */
  Container.factory = function (key, value) {
    if (typeof value !== 'function') {
      throw new Error('Value for "%s" is not a function'.replace('%s', key))
    }

    this.set(key, value);
    factories.push(key);
  };


  _.extend(Container, {
    getWidget: function () {
      return Container.get('widget');
    },
    getSettings: function ($modal_body) {
      return Container.get('settings', $modal_body);
    },
    getCardView: function (element_type) {
      return Container.get('card_view', element_type);
    }
  });

  return Container;
}));
