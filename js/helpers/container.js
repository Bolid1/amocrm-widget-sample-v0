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
      return new objects[key](Container, _(arguments).slice(1));
    }

    return objects[key];
  };

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
    this.set(key, value);
    factories.push(key);
  };


  _.extend(Container, {
    getWidget: function () {
      return Container.get('widget');
    }
  });

  return Container;
}));
