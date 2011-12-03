Ext.onReady(function(){
  var sorter = (function() {
    var type = 0;
    var types = ['label', 'created'];
    var direction = 0;
    var directions = ['ASC', 'DESC'];
    var labels = [Drupal.t('Label'), Drupal.t('Date Created')];
    return {
      toggleType: function() {
        type = type ? 0 : 1;
      },
      toggleDirection: function() {
        direction = direction ? 0: 1;
      },
      type: function() {
        return types[type];
      },
      label: function() {
        return labels[type];
      },
      direction: function() {
        return directions[direction];
      },
      refresh: function() {
        var store = Ext.data.StoreManager.lookup('members');
        store.sorters.clear();
        store.sorters.add(new Ext.util.Sorter({
          property: this.type(),
          direction: this.direction()
        }));
        store.load();
      }
    };
  })();
  
  Ext.define('ContentModelViewer.widgets.CollectionPanel', {
    extend: 'Ext.panel.Panel',
    itemId: 'collection',
    title: Drupal.t('Collection'),
    dockedItems: [{
      xtype: 'toolbar',
      dock: 'top',
      items: [ {
        xtype: 'tbtext', 
        text: Drupal.t('Sort By: ')
      }, Ext.create('Ext.Action', {
        text : sorter.label(),
        handler: function(action, event) {
          sorter.toggleType();
          action.setText(sorter.label());
          sorter.refresh();
        }
      }), {
        xtype: 'sortbutton',
        text : sorter.direction(),
        listeners: {
          changedirection: function(direction) {
            sorter.toggleDirection();
            this.setText(sorter.direction());
            sorter.refresh();
          }
        }
      }, {
        xtype: 'tbtext',
        text: Drupal.t('Search')
      }, {
        xtype: 'textfield',
        hideLabel: true
      }, {
        xtype: 'button',
        text: Drupal.t('Go'),
        handler: function(button, event) {
          var store = Ext.data.StoreManager.lookup('members');
          var filters = store.filters;
          var label = filters.get(0);
          var toolbar = button.up('toolbar');
          var search = toolbar.down('textfield');
          var value = Ext.String.trim(search.getValue());
          label.value = value != '' ? value : null;
          store.load();
        }
      }, '->', {
        xtype: 'button',
        text: Drupal.t('Add to this Collection'),
        handler: function(button, event) {
          var form = Ext.get("datastream-edit-form");
          form.set({
            action: window.location // Same Spot.
          });
          var action = form.down('input[name="action"]');
          action.set({
            value: 'ingest'
          });
          document.forms["datastream-edit-form"].submit();
        }
      }]
    },  {
      id: 'collection-pager-top',
      xtype: 'pagingtoolbar',
      store: Ext.data.StoreManager.lookup('members'),   // same store GridPanel is using
      dock: 'top',
      displayInfo: true,
      displayMsg : Drupal.t('Displaying {0} - {1} of {2}'),
      emptyMsg : Drupal.t('No data to display'),
      beforePageText : Drupal.t('Page'),
      afterPageText : Drupal.t('of {0}'),
      firstText : Drupal.t('First Page'),
      prevText : Drupal.t('Previous Page'),
      nextText : Drupal.t('Next Page'),
      lastText : Drupal.t('Last Page'),
      refreshText : Drupal.t('Refresh')
    }, {
      id: 'collection-pager-bottom',
      xtype: 'pagingtoolbar',
      store: Ext.data.StoreManager.lookup('members'),   // same store GridPanel is using
      dock: 'bottom', 
      displayInfo: true,
      displayMsg : Drupal.t('Displaying {0} - {1} of {2}'),
      emptyMsg : Drupal.t('No data to display'),
      beforePageText : Drupal.t('Page'),
      afterPageText : Drupal.t('of {0}'),
      firstText : Drupal.t('First Page'),
      prevText : Drupal.t('Previous Page'),
      nextText : Drupal.t('Next Page'),
      lastText : Drupal.t('Last Page'),
      refreshText : Drupal.t('Refresh')
    }],
    items: [{
      xtype: 'dataview',
      store: Ext.data.StoreManager.lookup('members'),
      itemSelector: 'div.file-item',
      emptyText: Drupal.t('No Files Available'),
      deferEmptyText: false,
      itemTpl: new Ext.XTemplate(
        '<tpl for=".">',
        '   <div class="member-item">',
        '       <a href="{link}">',
        '           <img class="member-item-img" src="{tn}"></img>',
        '       </a>',
        '       <a href="{link}">',
        '       <h2 class="member-item-label">{label}</h2>',
        '       </a><br/>',
        '       <div class="member-item-description">{[fm.ellipsis(values.description, 400, true)]}</div>',
        '   </div>',
        '</tpl>',
        {
          compiled: true,
          disableFormats: true,
          getLabel: function(label) {
            var empty = jQuery.trim(label) == '';
            return empty ? Drupal.t('Default Label: (Please notify an administrator to provide a label)') : label;
          }
        })
    }]
  });
});