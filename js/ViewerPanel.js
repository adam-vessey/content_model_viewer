Ext.onReady(function(){
  Ext.define('ContentModelViewer.widgets.ViewerPanel', {
    extend: 'Ext.panel.Panel',
    itemId: 'viewer',
    title: Drupal.t('Viewer'),
    layout: {
      type: 'border'
    },
    items: [{
      xtype: 'panel',
      region: 'center',
      id: 'datastream-viewer',
      autoScroll: true,
      loader: {
        url: ContentModelViewer.properties.url.datastream.view(ContentModelViewer.properties.dsid),
        renderer: 'html',
        loadMask: true,
        autoLoad: true,
        success: function() {
          ContentModelViewer.functions.callDatastreamViewFunction();
        }
      }
    }, {
      xtype: 'panel',
      title: Drupal.t('Files'),
      width: 260,
      collapsible: true,
      collapsed: false,
      split: true,
      region: 'east',
      dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
          xtype: 'button',
          text: Drupal.t('View'),
          cls: 'x-btn-text-icon',
          iconCls: 'view-datastream-icon',
          disabled: true,
          id: 'viewer-view-file',
          handler : function() {
            var view = this.up('panel').down('dataview');
            var selectionModel = view.getSelectionModel();
            if(selectionModel.hasSelection()) {
              var record = selectionModel.selected.first();
              ContentModelViewer.functions.selectDatastreamRecord(record);
              ContentModelViewer.functions.viewSelectedDatastreamRecord();
            }
          }
        }, {
          xtype: 'button',
          text: Drupal.t('Download'),
          cls: 'x-btn-text-icon',
          iconCls: 'download-datastream-icon',
          disabled: true,
          id: 'viewer-download-file',
          handler : function() {
            var view = this.up('panel').down('dataview');
            var selectionModel = view.getSelectionModel();
            if(selectionModel.hasSelection()) {
              var record = selectionModel.selected.first();
              var dsid = record.get('dsid');
              var url = ContentModelViewer.properties.url.datastream.download(dsid);
              var form = Ext.get("datastream-download-form");
              form.set({
                action: url
              });
              document.forms["datastream-download-form"].submit();
            }
          }
        }]
      },{
        xtype: 'pagingtoolbar',
        store: Ext.data.StoreManager.lookup('files'),   // same store GridPanel is using
        dock: 'bottom'
      }],
      items: [{
        xtype: 'dataview',
        store: Ext.data.StoreManager.lookup('files'),
        itemSelector: 'div.file-item',
        emptyText: Drupal.t('No Files Available'),
        deferEmptyText: false,
        itemTpl: new Ext.XTemplate(
          '<tpl for=".">',
          '   <div class="file-item">',
          '       <div class="file-item-dsid">{[fm.ellipsis(values.dsid, 30, true)]}</div>',
          '       <img class="file-item-img file-item-show-view" src="{tn}"></img>',
          '       <tpl if="this.showLabel(label)">',
          '           <div class="file-item-label">{[fm.ellipsis(values.label, 30, true)]}</div>',
          '       </tpl>',
          '   </div>',
          '</tpl>',
          {
            compiled: true,
            disableFormats: true,
            showLabel: function(label) {
              return jQuery.trim(label) != '';
            }
          }),
        listeners: {
          selectionchange: function(view, selections, options) {
            var button, record = selections[0];
            if(record) {
              button = Ext.getCmp('viewer-view-file');
              record.get('view') ? button.enable() : button.disable();
              button = Ext.getCmp('viewer-download-file');
              record.get('download') ? button.enable() : button.disable();
            }
          } 
        }    
      }]
    }]
  });
});