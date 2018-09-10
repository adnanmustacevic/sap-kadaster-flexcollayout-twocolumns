sap.ui.define([
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";
	return {
		loadDataModelFromFile: function () {
            var promise = jQuery.Deferred();
            var promises = [];
            var dataModel = {};

            promises.push(this.getDataFromFile("/model/employeesModel.json"));

            jQuery.when.apply(jQuery, promises).then(function(tileModel) {
                dataModel.employeesModel = tileModel.getData();
                promise.resolve(dataModel);
            }, function(error) {
                promise.reject(error);
            });
            return promise;
        },
		/**
		 * Utilities
		 * @public
		 * @param {string} fileURI relative path to the file that contains the JSON data
		 * @returns promise
		 */
		getDataFromFile: function(fileURI) {
			var promise = jQuery.Deferred();
			var effectiveUrl = jQuery.sap.getModulePath("nl.kadaster.test.flexcollayout.mycolleagues.") + fileURI;
			new sap.ui.model.json.JSONModel(effectiveUrl).attachRequestCompleted(function() {
				promise.resolve(this);
			});
			return promise;
		},

		createEmployeeDataUIModelFromData: function(oDataModel) {
			var employeetUiModel = {};
			employeetUiModel.Afdeling = oDataModel.Afdeling;
			employeetUiModel.ID = oDataModel.ID;
			employeetUiModel.afbeeldingen = oDataModel.afbeeldingen;
			employeetUiModel.bijzonderheden = oDataModel.bijzonderheden;
			employeetUiModel.doorkiesPrefix = oDataModel.doorkiesPrefix;
			employeetUiModel.doorkiesnummer = oDataModel.doorkiesnummer;
			employeetUiModel.doorkiessamen = oDataModel.doorkiessamen;
			employeetUiModel.emailadres = oDataModel.emailadres;
			employeetUiModel.emailadres4 = oDataModel.emailadres4;
			employeetUiModel.functie = oDataModel.functie;
			employeetUiModel.gebouw = oDataModel.gebouw;
			employeetUiModel.kamer = oDataModel.kamer;
			employeetUiModel.links = oDataModel.links;
			employeetUiModel.locatie = oDataModel.locatie;
			employeetUiModel.manager = oDataModel.manager;
			employeetUiModel.mobiel = this.formatMobielNummer(oDataModel.mobiel, 2);
			employeetUiModel.naam = oDataModel.naam;
			employeetUiModel.organisatie = oDataModel.organisatie;
			employeetUiModel.roepnaam = oDataModel.roepnaam;
			employeetUiModel.roepnaam3 = oDataModel.roepnaam3;
			employeetUiModel.secratariaat = oDataModel.secratariaat;
			employeetUiModel.secretariaat = oDataModel.secretariaat;
			employeetUiModel.telefoonnummerSEC = oDataModel.telefoonnummerSEC;
			employeetUiModel.telefoonnummerSEC2 = oDataModel.telefoonnummerSEC2;
			employeetUiModel.werkrooster = oDataModel.werkrooster;

			return employeetUiModel;
		},

		handleErrorMessage: function(message) {
			sap.m.MessageBox.show(message, {
				icon: MessageBox.Icon.ERROR,
				title: "Fout",
				actions: MessageBox.Action.OK,
				onClose: null,
				styleClass: ""
			});
		},

		formatMobielNummer: function(mobielNummer, size) {
			var regularExpression = new RegExp(".{1," + size + "}", "g");
			var formattedMobielNumber = "";
			if (mobielNummer) {
				// remove spaces from mobielNummer
				formattedMobielNumber = mobielNummer.replace(/\s/g, "");
			}			
			var chunkArray = formattedMobielNumber.match(regularExpression);
			if (chunkArray) {
				return chunkArray.join(" ");
			} else {
				return "";
			}
		}		

	};
});