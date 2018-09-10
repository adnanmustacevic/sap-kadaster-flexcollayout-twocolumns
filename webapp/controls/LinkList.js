sap.ui.define("sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controls.LinkList",[ 
    "sap/ui/core/Control"
], function(Control) {
    "use strict";
 
    var LinkList = Control.extend("sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controls.LinkList", {
        // the control API:
        metadata : {
            properties : {
            },
                            
            aggregations : {
            	"items": {
            		type: "sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controls.LinkListItem",
            		// multiple: "false",
            		singularName: "item"
            	}
            },

	        events : {}
        },

        init : function(){
        },
                        
        onAfterRendering: function (){
            //called after instance has been rendered (it's in the DOM)
        },
                        
        _somePrivateMethod : function () { /*do someting...*/ },
                         
        somePublicMethod : function () { /*do someting...*/ },

        renderer : {
            render : function(oRm, oControl) {
     //       	oRm.write("<div");
	    //         	oRm.writeControlData(oControl);
					// oRm.write(">");

				    
					$.each(oControl.getItems(),function(key,value){
					    oRm.write("<div style=\"float: left;\">");
						oRm.renderControl(value);
						oRm.write("</div>");
					});

				// oRm.write("</div>");
            }
        }
    });
 
    return LinkList;
 
});