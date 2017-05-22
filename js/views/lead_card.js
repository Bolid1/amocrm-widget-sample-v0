define(['underscore', './card_visible.js', './../helpers/container.js'],
  /**
   * @param {_} _
   * @param {SampleWidgetCardVisible} BaseView
   * @param {Container} Container
   * @return {SampleWidgetCardVisibleLeads}
   */
  function (_, BaseView, Container) {
    return BaseView.extend(
      /**
       * @class SampleWidgetCardVisibleLeads
       * @extends SampleWidgetCardVisible
       * @description Работа в карточках с визуальным отображением
       */
      {
        /**
         * @member {JQuery}
         */
        _$submit: null,

        /**
         * @member {JQuery}
         */
        _$input: null,

        /**
         * @member {JQuery}
         */
        _$select: null,

        /**
         * @member {Modal}
         */
        _modal: null,

        events: function () {
          return {
            'change .js-example_input': 'checkCanSubmit',
            'input .js-example_input': 'checkCanSubmit',
            'keyup .js-example_input': 'checkCanSubmit',
            'change .js-example_select': 'checkCanSubmit',
            'click .js-submit.active': 'submit'
          };
        },

        /**
         * @param {Object} params
         * @param {JQuery} params.el
         * @param {RenderClass} params.render_object
         * @param {I18nClass} params.i18n
         * @param {String} params.element_type
         * @constructor
         */
        initialize: function (params) {
          params || (params = {});
          params.element_type = 'leads';
          BaseView.prototype.initialize.apply(this, arguments);
        },

        /**
         * @methodOf SampleWidgetCardVisibleLeads
         * @this SampleWidgetCardVisibleLeads
         * @return {SampleWidgetCardVisibleLeads}
         */
        render: function () {
          this._render_object.render('cards/leads', _.bind(this._render, this));
          return this;
        },

        _render: function (template, params) {
          var self = this;
          var fields = [
            {
              template: 'input',
              params: {
                name: 'example_input',
                class_name: 'js-example_input',
                placeholder: self._i18n.get('card.leads.example_input.placeholder')
              }
            },
            {
              template: 'select',
              params: {
                name: 'example_select',
                class_name: 'js-example_select',
                items: [
                  {id: 0, option: '...'},
                  {id: 1, option: 'First'},
                  {id: 2, option: 'Second'},
                  {id: 3, option: 'Third'},
                  {id: 4, option: 'Fourth'}
                ],
                selected: 3
              }
            },
            {
              template: 'button',
              params: {
                name: 'example_button',
                text: self._i18n.get('card.leads.submit'),
                class_name: 'js-submit button-input-disabled'
              }
            }
          ];

          this.$el.html($(template.render(params)));

          _.each(fields, function (field) {
            if (!(field && field.params && field.params.name)) {
              return;
            }

            this._render_object.renderCoreControl(field.template, function (template) {
              var $replace = self.$el.find('.js-' + field.params.name);

              if (!$replace.length) {
                return;
              }

              $replace.replaceWith($(template.render(field.params)));
            });
          }, this);

          this._$submit = this.$el.find('.js-submit');
          this._$input = this.$el.find('input[name="example_input"]');
          this._$select = this.$el.find('input[name="example_select"]');
        },

        canSubmit: function () {
          var selected = this._$select.val();
          selected = !isNaN(selected) ? parseInt(selected) : 0;

          var input = '' + this._$input.val();

          return input.length > 0 && selected > 0;
        },

        checkCanSubmit: function () {
          var can_submit = this.canSubmit();

          this._$submit.toggleClass('button-input-disabled', !can_submit);
          this._$submit.toggleClass('button-input_blue active', can_submit);
        },

        _modal_template: _.template(
          '<div>' +
          '<%= i18n.get("card.leads.modal.selected") %>: <%= selected %><br\>' +
          '<%= i18n.get("card.leads.modal.input") %>: <%- input %><br\>' +
          '</div>'
        ),

        submit: function () {
          if (!this.canSubmit()) {
            return false;
          }

          var selected = this._$select.val();
          selected = !isNaN(selected) ? parseInt(selected) : 0;

          var input = '' + this._$input.val();

          var data = {
            i18n: this._i18n,
            selected: selected,
            input: input
          };

          var params = {
            init: function ($modal_body) {
              const html = this._modal_template(data);
              $modal_body
                .html(html)
                .trigger('modal:loaded')
                .trigger("modal:centrify");
            }.bind(this)
          };

          this._modal = Container.get('modal', params);
        },

        remove: function () {
          var originResult = BaseView.prototype.remove.apply(this, arguments);

          if (this._modal && _.isFunction(this._modal.destroy)) {
            this._modal.destroy();
            this._modal = null;
          }

          return originResult;
        }
      }
    );
  }
);
