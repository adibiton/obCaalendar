var demo = demo || {};
demo.app = demo.app || {};

demo.app.View = (function(){
    'use strict';

    /**
     * View that abstracts away the browser's DOM completely.
     * It has two simple entry points:
     *
     *   - bind(eventName, handler)
     *   - render(command, parameterObject)
     *     Renders the given command with the options
     */
    function View(template) {
        this.template = template;
        this.$eventsList = document.querySelector('.events');
    }
    View.prototype.render = function (viewCmd, parameter) {
        var that = this;
        var viewCommands = {
            showEntries: function () {
                that.$eventsList.innerHTML = that.template.show(parameter);
            }
        };

        viewCommands[viewCmd]();
    };
	return View;
}());
