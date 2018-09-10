sap.ui.define("sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controls.LinkListItem",[ 
    "sap/ui/core/Control"
], function(Control) {
    "use strict";
 
    var LinkListItem = Control.extend("sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controls.LinkListItem", {
        // the control API:
        metadata : {
            properties : {
	            "profileId" : "string",
	            "text" : "string"
            },
                            
            aggregations : {
            },

	        events : {
	            "select" : {}
	        }
        },

        init : function(){
        },
                        
        onAfterRendering: function () {
        },
                        
        _somePrivateMethod : function () { /*do someting...*/ },
                         
        somePublicMethod : function () { /*do someting...*/ },
 
	    onclick : function(event) {
	    	event.preventDefault();
	        this.fireSelect();
	    },
    
        renderer : {
            render : function(oRm, oControl) {
	            oRm.write("<div");
	            oRm.writeControlData(oControl);
				oRm.write(">");
				    oRm.write("<div style=\"display: none; width: fit-content;\">" + oControl.getProfileId() + "</div>");
				    oRm.write("<span");
						oRm.addClass("sapMText");
						oRm.addClass("sapMTextNoWrap");
						oRm.addClass("sapUiSelectable");	
						// oRm.addClass("sapMLnkMaxWidth");
						// oRm.addClass("sapMLnk");
			        	oRm.writeClasses();
			 		    oRm.write("style=\"width: 100%; text-align: left;\" >");
			 		    oRm.write("<a href=\"#\" role=\"link\" class=\"sapMLnk sapMLnkMaxWidth\" style=\"text-align:left\">");
			 		    oRm.write(oControl.getText() + "</a>"); 
				    oRm.write("</span>");
				oRm.write("</div>");
            }
        }
    });
 
    return LinkListItem;
 
});