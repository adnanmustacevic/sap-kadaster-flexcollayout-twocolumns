sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	"sap/kadaster/FlexibleColumnLayoutWithTwoColumns/util/Util",
	"sap/kadaster/FlexibleColumnLayoutWithTwoColumns/util/ODataServiceUtil"
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, Util, ODataServiceUtil) {
	"use strict";

	return Controller.extend("sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controller.BeginCol", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
			this.getValueHelp();
		},
		
		
		getValueHelp: function() {
			var that = this;
			this.model = {};
		    jQuery.when(ODataServiceUtil.getValueHelpList("Rol")).then(function(rolValueHelp) {
				that.model.rolValueHelp = rolValueHelp;
		        return ODataServiceUtil.getValueHelpList("Gebouw");
		    }).then(function(gebouwValueHelp) {
				that.model.gebouwValueHelp = gebouwValueHelp;
		        return ODataServiceUtil.getValueHelpList("Organisatie");				
		    }).then( function(organisatieValueHelp) {
				that.model.organisatieValueHelp = organisatieValueHelp;	
		    }).fail(function(error) {
				//ShowError
		    });			
		},
		
		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				productPath = oEvent.getSource().getBindingContext("products").getPath(),
				product = productPath.split("/").slice(-1).pop();

			this.oRouter.navTo("midCol", {layout: oNextUIState.layout, product: product});
		},
		onSearch: function (oEvent) {
//			var oTableSearchState = [];
			var	sQuery = oEvent.getParameter("query");

/*			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.getView().byId("productsTable").getBinding("items").filter(oTableSearchState, "Application");*/
			var that = this;
			
			jQuery.when(ODataServiceUtil.getSearchResult(sQuery)).then(function(oData) {
				oData.results.forEach(function (element) {
					element.OfficeEmail  = element.OfficeEmail ? element.OfficeEmail.toLowerCase() : "";
					element.photoURL = "/sap/opu/odata/sap/HCM_EMPLOYEE_LOOKUP_SRV/EmployeeInfoSet('" + element.EmployeeNumber + "')/$value";
				});
				that.getView().setModel(new sap.ui.model.json.JSONModel(oData));
			});  




		},

		handleRowSellect: function(evt) {
			var that = this;
			var contextSource = evt.getSource();
			var bindingContext = contextSource.getBindingContext();
			var selectedEmployee = bindingContext.getModel().getObject(bindingContext.getPath());
			var imageURL = selectedEmployee.photoURL;

			jQuery.when(ODataServiceUtil.getEmployeeData(selectedEmployee.EmployeeNumber)).then(function(oData) {
				var oODataJSONModel = new sap.ui.model.json.JSONModel();
				oData.roles = that.getDataFromServiceResult(oData, "Rol", "rolValueHelp");
				oData.secretariaatVan = that.getDataFromServiceResult(oData, "SecretariaatVan", "organisatieValueHelp");
				oData.secretariaat = that.getDataFromServiceResult(oData, "Secretariaat");
				oData.manager = that.getDataFromServiceResult(oData, "Manager");	
				oData.linkItemsManager = that.getDataFromServiceResultPersons(oData, "Manager");
				oData.linkItemsSecretariaat = that.getDataFromServiceResultPersons(oData, "Secretariaat");
				var uiDataModel = oData;
				uiDataModel.Mobiel = Util.formatMobielNummer(uiDataModel.Mobiel, 2);
				uiDataModel.Email = uiDataModel.Email ? uiDataModel.Email.toLowerCase() : "";
				uiDataModel.PhotoUrl = imageURL;    
				uiDataModel.GebouwNaam = that.getNameById(oData.Gebouw, "gebouwValueHelp");
				oODataJSONModel.setData(uiDataModel);
				
				that.getOwnerComponent().setModel(oODataJSONModel, "employee");
				
				var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(1);
/*				productPath = contextSource.getBindingContext("products").getPath(),
				product = productPath.split("/").slice(-1).pop();*/

				that.oRouter.navTo("midCol", {layout: oNextUIState.layout, employee: selectedEmployee.EmployeeNumber});

			});  
		},

		onAdd: function (oEvent) {
			MessageBox.show("This functionality is not ready yet.", {
				icon: MessageBox.Icon.INFORMATION,
				title: "Aw, Snap!",
				actions: [MessageBox.Action.OK]
			});
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("productsTable"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},
		
		getDataFromServiceResultPersons: function(oData, name) {
			var values = this.getDataFromPersonalInfoUpdSet(oData, name);
			var personInfo = {};
			var persons = [];
			values.forEach(function(value) {
				if (value.Fieldvalue) {
					var personalId = value.Fieldvalue.split("|");
					personInfo.profileId = personalId[0].trim();
					personInfo.text = personalId[1].trim();					
				} else {
					personInfo.text = "";
					personInfo.profileId = "";
				}
				persons.push(personInfo);
			});
			if (persons.length === 0) {
				persons.push({
					text:"", 
					profileId:""
				});
			}
			return persons;
		},

		getDataFromServiceResult: function(oData, name, valueHelp) {
			var that = this;
			var values = this.getDataFromPersonalInfoUpdSet(oData, name);
			var fieldValue = [];
			values.forEach(function(value) {
				fieldValue.push(that.getNameById(value.Fieldvalue, valueHelp));
			});
			return fieldValue.join(", ");
		},
		
		getDataFromPersonalInfoUpdSet: function(oData, name) {
			return oData.PersonalInfoSet.results.filter(function(record) {
				return record.Fieldlabel === name;
			});
		},

		getNameById: function(id, valueHelpAttribute) {
			if (valueHelpAttribute) {
				return this.getNameFromValuHelp(id, valueHelpAttribute);
			} else {
				if (id) {
					var name = id.split("|");
					return name[1].trim();					
				}
			}
		},

		getNameFromValuHelp: function (id, valueHelpAttribute) {
			var valueHelp = this.model[valueHelpAttribute];
			var selectedValueHelp = valueHelp.results.filter(function(valueHelpElement){
				return id === valueHelpElement.FieldId;
			});
			if (selectedValueHelp.length > 0) {
				return selectedValueHelp[0].FieldValue;
			} else {
				return "";
			}			
		}
	});
}, true);