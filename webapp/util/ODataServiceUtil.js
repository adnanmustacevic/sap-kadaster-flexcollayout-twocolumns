sap.ui.define([
], function() {
	"use strict";
	return {
	 	
	 	getValueHelpList: function( fieldName) {
		    var promise = jQuery.Deferred();
			var oDataServiceUrl = "/sap/opu/odata/sap/ZHCM_PEOPLE_PROFILE_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(oDataServiceUrl, true);
	        var query = ["$filter=FieldName eq '" + fieldName + "'"];
	        //Voor secretariaten:
			//var query = "$filter=FieldName eq 'Organisatie' and FieldId eq '00000428'";
			oModel.read("/ValueHelpSet?" + query[0], null, null, true, function(oData) {
	            promise.resolve(oData);
			}, function(error) {
	        	promise.reject(error);
			});
			return promise;
		}, 
		
		getSearchResult: function(searchString) {
			var promise = jQuery.Deferred();
			var oDataServiceUrl = "/sap/opu/odata/sap/ZHCM_EMPLOYEE_LOOKUP_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(oDataServiceUrl, true);
			oDataModel.read("/SearchResultSet?search=" + searchString, null, null, true,
				function(data) {
					promise.resolve(data);
				}, 
				function(error) {
					promise.reject(error);
				});
			return promise;
		},
		
		getEmployeeData: function(employeeNumber) {
			var promise = jQuery.Deferred();
			var oDataServiceUrl = "/sap/opu/odata/sap/ZHCM_EMPLOYEE_LOOKUP_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(oDataServiceUrl, true);
			oDataModel.read("/EmployeeInfoSet('" + employeeNumber+ "')?$expand=PersonalInfoSet", null, null, true,
				function(data) {
					promise.resolve(data);
				}, 
				function(error) {
					promise.reject(error);
				});
			return promise;
		},

        getImage: function(employeeNumber) {
			var promise = jQuery.Deferred();
			var imageURL ="/sap/opu/odata/sap/ZHCM_EMPLOYEE_LOOKUP_SRV/EmployeeInfoSet('" + employeeNumber+ "')/$value";
			$.ajax({
			    url: imageURL, 
			    type: "GET",
	            success : function(data, textStatus, jqXHR) {
	        		promise.resolve({employeeNumber:employeeNumber, data:data});
	            },
	            error: function(xhr, status) {
	               promise.reject(status);
	            }
			});
			return promise;
        },

		getHierarchy: function(employeeNumber, oDataServiceUrl) {
			var promise = jQuery.Deferred();
			var oDataModel = new sap.ui.model.odata.ODataModel(oDataServiceUrl, true);			
			var queryPath = "HierarchyPanelSet?$filter= EmployeeNumber eq '" + employeeNumber + "'";	
			oDataModel.read(queryPath, null, null, true, 
				function(data) {
					promise.resolve(data);
				}, 
				function(error) {
					promise.reject(error);
				});
			return promise;
		},	

		getBaseURL: function(urlExt) {
			var protocol = window.location.protocol;
			var host = window.location.hostname;
			var port = window.location.port;
			var url = protocol + "//" + host;
			if (port) {
				url = url + ":" + port + "/" + urlExt;
			} else {
				url = url + "/" + urlExt;
			}
			return url;
		},

		// getDataServiceURL: function(urlExt) {
		// 	var url = this.getBaseURL(urlExt);
		// 	//<string>.startsWith is not supported by IE
		// 	if (this.strStartsWith(url, "https://" + "webidetesting")) {
		// 		return Config.getDevelopmentServerDetails().getData().dataServiceBaseURL + urlExt;
		// 	} else {
		// 		return url;
		// 	}
		// },

		strStartsWith: function(str, prefix) {
			return str.indexOf(prefix) === 0;
		},

		strEndsWith: function(inputString, suffix) {
			return inputString.indexOf(suffix, inputString.length - suffix.length) !== -1;
		}
	};
});