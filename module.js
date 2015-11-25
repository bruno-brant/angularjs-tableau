angular.module('tableau-api-test', [])
.directive('psEmbeddedTableauReport', function () {
    return {
        template: '<div class="embed-responsive embed-responsive-16by9><iframe></iframe></div>',
        link: function (scope, element, attrs) {
            var div = element.children(0)[0];
			var iframe = element.children(0).children(0)[0];
			
            // Check for required attributes
            if (attrs === undefined)
                throw "Attributes are required the ps-embedded-tableau element.";
            
            if (attrs.ReportId === undefined)
                throw "Must define the report id to be  attribute in the ps-embedded-tableau element."
            
            // Apply default values for attributes
            if (attrs.tabs === undefined)
                attrs.tabs = 'no';
            
            if (attrs.hideToolbar === undefined)
                attrs.hideToolbar = true;
            
            if (attrs.width === undefined)
                attrs.width = element.offsetWidth;
            
            if (attrs.height === undefined)
                attrs.height = element.offsetHeight;
            
            var divPlaceholder = element.children(0)[0]; // obtain the div that is a child to this element
            
            var options = {
                width: attrs.offsetWidth,
                height: attrs.offsetHeight,
                hideTabs: attrs.hideTabs,
                hideToolbar: attrs.hideToolbar,
                onFirstInteractive: function() {
                    workbook = viz.getWorkbook();
                    activeSheet = workbook.getActiveSheet();
                }
            };
            
            viz = new tableau.Viz(divPlaceholder, attrs.url, options);
        }
    };
}
);