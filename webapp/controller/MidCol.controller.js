sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("sap.kadaster.FlexibleColumnLayoutWithTwoColumns.controller.MidCol", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("beginCol").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("midCol").attachPatternMatched(this._onProductMatched, this);
		},
		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("midCol", {layout: sNextLayout, employee: this._product});
		},
		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("midCol", {layout: sNextLayout, employee: this._product});
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("beginCol", {layout: sNextLayout});
		},
		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").employee || this._product || "0";
			this.getView().bindElement({
				path: "/ProductCollection/" + this._product,
				model: "employee"
			});
		}
	});
}, true);