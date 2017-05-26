define(['underscore'],
  /**
   * @param {UnderscoreStatic} _
   * @return {Logger}
   */
  function (_) {
    const DEBUG_LEVEL_SILENT = 0;
    const DEBUG_LEVEL_ERROR = 1;
    const DEBUG_LEVEL_LOG = 2;

    var Logger = function (widget) {
      this._widget = widget;
      this._prefix = null;
      //noinspection JSUnresolvedVariable
      this._level = AMOCRM && AMOCRM.environment === 'dev' ? DEBUG_LEVEL_LOG : DEBUG_LEVEL_ERROR;
    };

    _.extend(Logger.prototype, {
      _applyPrefix: function (args) {
        if (this._prefix === null) {
          this._prefix = 'widget[' + this._widget.get_settings().widget_code + ']:';
        }

        var result = _(arguments).toArray();
        if (typeof args[0] === 'string') {
          result[0] = this._prefix + ' ' + args[0];
        } else {
          result.unshift(this._prefix);
        }

        return result;
      },

      debug: function () {
        if (this._level > DEBUG_LEVEL_LOG) {
          window.console.debug.apply(null, this._applyPrefix(arguments));
        }
      },

      log: function () {
        if (this._level > DEBUG_LEVEL_ERROR) {
          window.console.log.apply(null, this._applyPrefix(arguments));
        }
      },

      error: function () {
        if (this._level > DEBUG_LEVEL_SILENT) {
          window.console.error.apply(null, this._applyPrefix(arguments));
        }
      }
    });

    return Logger;
  }
);
