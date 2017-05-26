define(['underscore', './base_view.js', './../helpers/container.js', 'es6promise'],
  /**
   * @param {UnderscoreStatic} _
   * @param {SampleWidgetBaseView} BaseView
   * @param {Container} Container
   * @param {Object} PromiseLib
   * @param {Promise} PromiseLib.Promise
   * @return {SampleWidgetLeadsListView}
   */
  function (_, BaseView, Container, PromiseLib) {
    const Promise = PromiseLib.Promise;

    return BaseView.extend(
      /**
       * @class SampleWidgetLeadsListView
       * @extends SampleWidgetBaseView
       * @description Работа в списке сделок
       * @this SampleWidgetLeadsListView
       */
      {
        /**
         * @member {Array.<Number>}
         */
        _ids: null,

        /**
         * @member {Modal}
         */
        _modal: null,

        /**
         * @member {RequesterClass}
         */
        _requester: null,

        /**
         * @member {JQuery}
         */
        _$modal_body: null,

        /**
         * @member {Object}
         */
        _xhr: null,

        events: {
          'click .js-navigate-link': 'remove'
        },

        initialize: function (params) {
          BaseView.prototype.initialize.apply(this, arguments);
          this._ids = params.ids;
          this._requester = params.requester;
          this._xhr = {};

          Promise.all([
            new Promise(_.bind(this.initModal, this)),
            new Promise(_.bind(this.loadInfo, this)),
            this._render_object.renderPromise('lists/leads')
          ]).then(_.bind(this.render, this), _.bind(this.onError, this));
        },

        initModal: function (resolve) {
          this._modal = Container.get('modal', {
            init: resolve,
            destroy: _.bind(function () {
              _.each(this._xhr, function (xhr) {
                if (xhr && !_.isUndefined(xhr.status)) {
                  xhr.abort();
                }
              });
              this._xhr = {};

              this.remove(true);

              return true;
            }, this)
          });
        },

        loadInfo: function (resolve, reject) {
          if (!this._ids || !this._ids.length) {
            return reject('Empty ids');
          }

          this.loadLinks(this._ids).then(_.bind(function (links) {
            if (!Array.isArray(links) || !links.length) {
              return reject('Linked contacts not found');
            }
            this._ids = _.unique(_.collect(links, 'lead'));

            Promise.all([
              this.loadLeads(_.unique(_.collect(links, 'lead'))),
              this.loadContacts(_.collect(links, 'contact'))
            ]).then(_.bind(function (data) {
              resolve({links: links, leads: data[0], contacts: data[1]});
            }, this), reject)
          }, this), reject);
        },

        loadLinks: function (leads_ids) {
          return new Promise(_.bind(function (resolve, reject) {
            const params = {
              url: '/private/api/v2/json/links/list',
              data: {
                links: [
                  {
                    from: 'leads',
                    from_id: leads_ids,
                    to: 'contacts'
                  }
                ]
              }
            };

            const success = function (response) {
              var data = [];

              if (response && response.response && response.response.links) {
                data = response.response.links;
              }

              resolve(_.map(data, function (link) {
                return {
                  lead: link.from_id,
                  contact: link.to_id
                };
              }));
            };

            const error = _.bind(function () {
              reject(this._i18n.get('errors.xhr.load_links'))
            }, this);

            this.makeRequest('links', params, success, error);
          }, this));
        },

        loadLeads: function (leads_ids) {
          return this.loadElements('leads', leads_ids);
        },

        loadContacts: function (contacts_ids) {
          return this.loadElements('contacts', contacts_ids);
        },

        loadElements: function (type, ids) {
          return new Promise(_.bind(function (resolve, reject) {
            const params = {
              url: '/private/api/v2/json/' + type + '/list',
              data: {
                id: ids
              }
            };

            const success = function (response) {
              var data = [];

              if (response && response.response && response.response[type]) {
                data = response.response[type];
              }

              resolve(data);
            };

            const error = _.bind(function () {
              reject(this._i18n.get('errors.xhr.load_' + type))
            }, this);

            this.makeRequest('type', params, success, error);
          }, this));
        },

        makeRequest: function (name, params, success, error) {
          const deleteXHR = _.bind(function (func) {
            delete this._xhr[name];
            func.apply(this, _(arguments).slice(1));
          }, this);

          this._xhr[name] = this._requester.get(params, 'direct');

          this._xhr[name].success(_.wrap(success, deleteXHR));

          this._xhr[name].error(_.wrap(error, deleteXHR));
        },

        onError: function (error) {
          this._modal.showError(error);
        },

        /**
         * @param {Array} data
         * @return {SampleWidgetLeadsListView}
         */
        render: function (data) {
          /**
           * @type {Object} params
           * @property {JQuery} params.$modal_body
           * @property {{links: Array.<Object>, leads: Array.<Object>, contacts: Array.<Object>}} params.info
           * @property {Object} params.tmpl
           * @property {Template} params.tmpl.template
           * @property {Object} params.tmpl.params
           */
          var params = _.object(['$modal_body', 'info', 'tmpl'], data);
          var items = [];
          var formatted_contacts = _.map(params.info.contacts, function (contact) {
            return {
              id: parseInt(contact.id),
              name: contact.name,
              phones: _(contact.custom_fields)
                .filter(function (field) {
                  return field.code === 'PHONE';
                })
                .map(function (field) {
                  return _.map(field.values, function (value) {
                    return value.value;
                  });
                })
            };
          });

          formatted_contacts = _.filter(formatted_contacts, function (contact) {
            return contact.phones.length !== 0;
          });

          _.each(params.info.leads, function (lead) {
            var lead_id = parseInt(lead.id);
            var contacts_ids = _.chain(params.info.links).where({lead: lead_id}).collect('contact').value();
            var contacts = _.filter(formatted_contacts, function (contact) {
              return contacts_ids.indexOf(contact.id) !== -1;
            });

            items.push({
              id: lead_id,
              name: lead.name,
              contacts: contacts
            });
          });

          this.setElement(params.$modal_body);

          this.$el
            .html(params.tmpl.template.render(_.extend(params.tmpl.params, {items: items})))
            .trigger('modal:loaded')
            .trigger("modal:centrify");

          this.appendStyles('lists/leads');

          return this;
        },

        remove: function (from_modal) {
          if (!from_modal && this._modal && _.isFunction(this._modal.destroy)) {
            this._modal.destroy();
          }

          return BaseView.prototype.remove.apply(this, arguments);
        }
      }
    )
  }
);
