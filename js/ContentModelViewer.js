/**
 * Display the viewer.
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    var parent = $('#tabs-tabset').parent();
    if(parent.length) {
        var content_model_viewer = $('#content-model-viewer');
        var content = content_model_viewer.remove();
        parent.empty();
        parent.append(content);    
    }
    var tabs = [];
    // Create Tabs for each of the Panels if they are defined 
    if(ContentModelViewer.widgets.CollectionPanel !== undefined) {
        tabs.push(Ext.create('ContentModelViewer.widgets.CollectionPanel'));
    }
    if(ContentModelViewer.widgets.OverviewPanel !== undefined) {
        tabs.push(Ext.create('ContentModelViewer.widgets.OverviewPanel'));
    }
    if(ContentModelViewer.widgets.ViewerPanel !== undefined) {
        tabs.push(Ext.create('ContentModelViewer.widgets.ViewerPanel'));
    }
    if(ContentModelViewer.widgets.ManagePanel !== undefined) {
        tabs.push(Ext.create('ContentModelViewer.widgets.ManagePanel'));
    }
    var viewer = Ext.create('Ext.tab.Panel', {
        width: ContentModelViewer.properties.width,
        height: ContentModelViewer.properties.height,
        renderTo: 'content-model-viewer',
        items: tabs
    });
    viewer.show();
});