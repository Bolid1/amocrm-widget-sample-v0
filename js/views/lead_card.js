define(['underscore', './card_visible.js'],
  /**
   * @param {_} _
   * @param {SampleWidgetCardVisible} BaseView
   * @return {SampleWidgetCardVisibleLeads}
   */
  function (_, BaseView) {
    return BaseView.extend(
      /**
       * @class SampleWidgetCardVisibleLeads
       * @extends SampleWidgetCardVisible
       * @description Работа в карточках с визуальным отображением
       */
      {
        /**
         * @member {jQuery}
         */
        _$submit: null,

        /**
         * @member {jQuery}
         */
        _$input: null,

        /**
         * @member {jQuery}
         */
        _$select: null,

        events: function () {
          return {
            'change .js-example_input': 'checkCanSubmit',
            'input .js-example_input': 'checkCanSubmit',
            'keyup .js-example_input': 'checkCanSubmit',
            'change .js-example_select': 'checkCanSubmit'
          };
        },

        /**
         * @param {Object} params
         * @param {jQuery} params.el
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

        checkCanSubmit: function () {
          var selected = this._$select.val();
          selected = !isNaN(selected) ? parseInt(selected) : 0;

          var input = '' + this._$input.val();

          var can_submit = input.length > 0 && selected > 0;

          this._$submit.toggleClass('button-input-disabled', !can_submit);
          this._$submit.toggleClass('button-input_blue', can_submit);
        }
      }
    );
  });
