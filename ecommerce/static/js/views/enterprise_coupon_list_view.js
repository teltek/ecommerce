define([
    'jquery',
    'backbone',
    'underscore',
    'underscore.string',
    'moment',
    'text!templates/enterprise_coupon_list.html',
    'dataTablesBootstrap'
],
    function($,
              Backbone,
              _,
              _s,
              moment,
              CouponListViewTemplate) {
        'use strict';

        return Backbone.View.extend({
            className: 'coupon-list-view',

            events: {
                'click .voucher-report-button': 'downloadCouponReport'
            },

            template: _.template(CouponListViewTemplate),
            linkTpl: _.template('<a href="/enterprise/coupons/<%= id %>/" class="coupon-title"><%= title %></a>'),
            downloadTpl: _.template(
                '<a href="" class="btn btn-secondary btn-small voucher-report-button"' +
                ' data-coupon-id="<%= id %>"><%=gettext(\'Download Coupon Report\')%></a>'),

            initialize: function() {
                this.listenTo(this.collection, 'update', this.refreshTableData);
            },

            getRowData: function(coupon) {
                return {
                    client: coupon.get('client'),
                    code: coupon.get('code'),
                    codeStatus: coupon.get('code_status'),
                    enterpriseCustomer: coupon.get('enterprise_customer'),
                    enterpriseCustomerCatalog: coupon.get('enterprise_customer_catalog'),
                    id: coupon.get('id'),
                    title: coupon.get('title'),
                    dateCreated: moment(coupon.get('date_created')).format('MMMM DD, YYYY, h:mm A')
                };
            },

            renderCouponTable: function() {
                var filterPlaceholder = gettext('Search...'),
                    $emptyLabel = '<label class="sr">' + filterPlaceholder + '</label>';

                if (!$.fn.dataTable.isDataTable('#couponTable')) {
                    this.$el.find('#couponTable').DataTable({
                        autoWidth: false,
                        info: true,
                        paging: true,
                        oLanguage: {
                            oPaginate: {
                                sNext: gettext('Next'),
                                sPrevious: gettext('Previous')
                            },

                            // Translators: _START_, _END_, and _TOTAL_ are placeholders. Do NOT translate them.
                            sInfo: gettext('Displaying _START_ to _END_ of _TOTAL_ coupons'),

                            // Translators: _MAX_ is a placeholder. Do NOT translate it.
                            sInfoFiltered: gettext('(filtered from _MAX_ total coupons)'),

                            // Translators: _MENU_ is a placeholder. Do NOT translate it.
                            sLengthMenu: gettext('Display _MENU_ coupons'),
                            sSearch: ''
                        },
                        order: [[0, 'asc']],
                        columns: [
                            {
                                title: gettext('Name'),
                                data: 'title',
                                fnCreatedCell: _.bind(function(nTd, sData, oData) {
                                    $(nTd).html(this.linkTpl(oData));
                                }, this)
                            },
                            {
                                title: gettext('Created'),
                                data: 'dateCreated'
                            },
                            {
                                title: gettext('Custom Code'),
                                data: 'code'
                            },
                            {
                                title: gettext('Status'),
                                data: 'codeStatus'
                            },
                            {
                                title: gettext('Client'),
                                data: 'client'
                            },
                            {
                                title: gettext('Enterprise Customer'),
                                data: 'enterpriseCustomer'
                            },
                            {
                                title: gettext('Enterprise Customer Catalog'),
                                data: 'enterpriseCustomerCatalog'
                            },
                            {
                                title: gettext('Coupon Report'),
                                data: 'id',
                                fnCreatedCell: _.bind(function(nTd, sData, oData) {
                                    $(nTd).html(this.downloadTpl(oData));
                                }, this),
                                orderable: false
                            }
                        ]
                    });

                    // NOTE: #couponTable_filter is generated by dataTables
                    this.$el.find('#couponTable_filter label').prepend($emptyLabel);

                    this.$el.find('#couponTable_filter input')
                        .attr('placeholder', filterPlaceholder)
                        .addClass('field-input input-text')
                        .removeClass('form-control input-sm');
                }
            },

            render: function() {
                this.$el.html(this.template);
                this.renderCouponTable();
                this.refreshTableData();
                return this;
            },

            /**
             * Refresh the data table with the collection's current information.
             */
            refreshTableData: function() {
                var data = this.collection.map(this.getRowData, this),
                    $table = this.$el.find('#couponTable').DataTable();

                $table.clear().rows.add(data).draw();
                return this;
            },

            /**
             * Download voucher report for a Coupon product
             */
            downloadCouponReport: function(event) {
                var couponId = $(event.currentTarget).data('coupon-id'),
                    url = '/api/v2/coupons/coupon_reports/' + couponId;

                event.preventDefault();
                window.open(url, '_blank');
                this.refreshTableData();
                return this;
            }
        });
    }
);
