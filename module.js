angular.module('tableau-api-test', [])
/**
 * Enable access to report definitions
 */
.factory('ReportCatalog', function () {
	return {
		/**
		 * Get the definition of a report, containing its name, whether customViews should be enabled and whether the toolbar should be enabled
		 * @return a json containing name, customViews and toolbar properties.
		 */
		GetReport: function (id) {
			// Mock data. Should call the back-end instead.
			data = {};
			
			data['report1'] = {
				name: 'views/_3749/sheet0',
				customViews: 'no',
				toolbar: 'no'
			};
			
			data['report2'] = { 
				name: 'shared/GMNZ87JBF',
				customViews: 'no',
				toolbar: 'no'				
			};
			
			return data[id];
		}
	};
})
/**
 * Used to obtain tickets to authorize the user against the Tableau server
 */
.factory('TableauTicketManager', function () {
	return {
		/**
		 * Should retrieve a ticket from the back-end, which, in turn, retrieves the ticket from the Tableau server
		 * @return A string with is a ticket for the current user.
		 */
		GetTicket: function () {
			// Mock implementation; Should call the back-end instead.
			return 'Etdpsm_Ew6rJY-9kRrALjauU';
		}
	};
})
/**
 * Used to retrieve system configuration
 */
.factory('ConfigurationManager', function () {
	// Mock data, should obtain this from the backend!!
	var data = {};
	data['host_name'] = 'https://public.tableau.com';  //https://public.tableau.com/views/_3749/sheet0?:embed=y&:toolbar=no&:loadOrderID=0&:display_count=yes&:showTabs=y
	data['site_root'] = undefined;//'/t/temp'; 
	data['embed'] = 'y';
	data['linktarget'] = '_self';
	data['tabs'] = 'yes';
	data['tooltip'] = 'yes';
	data['showShareOptions'] = 'no';
	data['display_count'] = 'no';
	data['loadOrderID'] = 0;
	data['use_ticket'] = false; // use this to control whether the ticket will be applied to the URL
	return {
		/**
		 * Return the configuration for the provided key.
		 */ 
		GetConfig: function (key) {
			return data[key];
		}
	}
})
/**
 * Embeds a Tableau report on a view.
 */
.directive('psTableauReport', 
['ReportCatalog', 'TableauTicketManager', 'ConfigurationManager', function (ReportCatalog, TableauTicketManager, ConfigurationManager) {
    return {
		restrict: 'E',
		replace: true,
        link: function (scope, element, attrs) {           
            // Check for required attributes
            if (attrs === undefined) throw "Attributes are required the ps-embedded-tableau element.";            
            if (attrs.reportid === undefined) throw "Must define the report id to be  attribute in the ps-embedded-tableau element."
			
			// Get system configuration
			var host_name = ConfigurationManager.GetConfig('host_name');
			var site_root = ConfigurationManager.GetConfig('site_root');
			var _embed = ConfigurationManager.GetConfig('embed');
			var linktarget = ConfigurationManager.GetConfig('linktarget');
			var tabs = ConfigurationManager.GetConfig('tabs');
			var tooltip = ConfigurationManager.GetConfig('tooltip');
			var showShareOptions = ConfigurationManager.GetConfig('showShareOptions');
			var displayCount = ConfigurationManager.GetConfig('display_count');
			var useTicket = ConfigurationManager.GetConfig('use_ticket');
			var loadOrderID = ConfigurationManager.GetConfig('loadOrderID');
				
			// Get the report definition
			var reportDefinition = ReportCatalog.GetReport(attrs.reportid);
			if (reportDefinition === undefined) throw 'No report with id ' + attrs.reportid + '.';            
            
			// Get the ticket
			var ticket;
			if (useTicket) ticket = TableauTicketManager.GetTicket();
			
			// Assemble the queryString (should use a function here...)
			var queryString = ''
				+ '?:customViews=' + reportDefinition.customViews 
				+ '&:toolbar=' +  reportDefinition.toolbar
				+ '&:embed=' + _embed
				+ '&:linktarget=' + linktarget
				+ '&:tabs=' + tabs
				+ '&:tooltip=' + tooltip
				+ '&:showShareOptions=' + showShareOptions
				+ '&:display_count=' + displayCount
				+ '&:loadOrderID=' + loadOrderID;
				
			// Assemble the URL (http://<host_name>/trusted/<ticket>/t/<site_root>/<name>?<options>)	
			var url = ''
			+ host_name 
			+ (useTicket ? ('/trusted/' + ticket) : '' )
			+ (site_root != undefined ? ('/t/' + site_root) : '')
			+ '/' 
			+ reportDefinition.name 
			+ queryString;
			
			// Optional attributes for the iframe (NOT USED YET)
            if (attrs.width === undefined)
                attrs.width = element.offsetWidth;
            
            if (attrs.height === undefined)
                attrs.height = element.offsetHeight;
            
			var iframeHtml = '<iframe class="embed-responsive-item" src="' + url + '"></iframe>';
			var divHtml = '<div class="embed-responsive embed-responsive-16by9">' + iframeHtml + '</div>';
			
			element.html(divHtml);
        }
    };
}])
.controller('ControllerReport1', function ($scope) {
	$scope.reportId = 'report1';
})
.controller('ControllerReport2', function ($scope) {
	$scope.reportId = 'report2';
})