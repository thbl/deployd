define("app",["require","exports","module"],function(a,b,c){var d=Backbone.Model.extend({defaults:{appName:"My App",appUrl:"",resourceType:""},initialize:function(){this.on("change:resourceTypeId",this.setDocLink,this),this.setDocLink()},setDocLink:function(){var a=this.get("resourceTypeId"),b="http://deployd.github.com/deployd/";a==="Static"?b+="#Files-Resource":a==="Collection"?b+="#Collection-Resource":a==="UserCollection"&&(b+="#User-Collection-Resource"),this.set("documentation",b)}});c.exports=new d}),define("view/save-status-view",["require","exports","module"],function(a,b,c){function g(a){d=$("#save-status"),a?(d.text(e),k(f)):(j(""),k(!1))}function h(){j("Saving..."),k(!0)}function i(){var a=new Date;j("Last saved "+a.toLocaleTimeString()),k(!1)}function j(a){e=a,d.text(a)}function k(a){a?d.removeClass("inactive"):d.addClass("inactive"),f=a}var d,e="",f=!1;c.exports={init:g,saving:h,saved:i},g()}),define("backbone-utils",["require","exports","module","./app","./view/save-status-view"],function(a,b,c){function h(a){return Object.prototype.toString.call(a)==="[object Array]"}var d=a("./app"),e=a("./view/save-status-view");Backbone.Model.prototype.idAttribute="_id",Backbone.View.prototype.close=function(){this.remove(),this.unbind()};var f=Backbone.sync;Backbone.sync=function(a,b,c){var g=_.isFunction(b.url)?b.url():b.url;g=d.get("appUrl")+g;if(a==="create"||a==="update"||a==="delete"){e.saving();var h=c.success,i=function(){e.saved(),h&&h.apply(this,arguments)};c.success=i}if(a==="create"||a==="update"){var j=c.data||b.toJSON();typeof j!="string"&&(Backbone.Utils.removeClientValues(j),c.contentType="application/json",c.data=JSON.stringify(j))}return c.headers={"x-dssh-key":d.get("authKey")},c.url=c.url||g,f(a,b,c)};var g=Backbone.History.prototype.checkUrl;Backbone.History.prototype.checkUrl=function(a){this._lastFragment=this.fragment;if(this.getFragment()!==this.fragment){var b={cancel:!1};this.trigger("load",b);if(b.cancel)return this.navigate(this.fragment,{trigger:!0,replace:!0}),a.preventDefault(),window.location.hash=this.fragment,!1}g.apply(this,arguments)},Backbone.Utils=Backbone.Utils||{},Backbone.Utils.removeClientValues=function(a){return h(a)?_.each(a,function(a,b){typeof a=="object"&&Backbone.Utils.removeClientValues(a)}):_.each(a,function(b,c){_.str.startsWith(c,"c_")?delete a[c]:typeof b=="object"&&Backbone.Utils.removeClientValues(b)}),a},Backbone.Utils.parseDictionary=function(a,b){var c={keyProperty:"label"};b=_.defaults(b||{},c);var d=Object.keys(a),e=[];return _.each(d,function(c){var d=a[c];d._id=c,d[b.keyProperty]=d[b.keyProperty]||c,e.push(d)}),e},Backbone.Utils.toJSONDictionary=function(a,b){var c={keyProperty:"label"};_.defaults(b,c);var d={};return _.each(a,function(a){var c=a[b.keyProperty];delete a[b.keyProperty],d[c]=a}),d},Backbone.Utils.cancelEvent=function(a){return!1}}),define("knockout-utils",["require","exports","module"],function(a,b,c){function e(a,b){var c;for(c in b)if(typeof a[c]=="undefined")return!1;for(c in b)if(b[c])switch(typeof b[c]){case"object":if(!e(a[c],b[c]))return!1;break;case"function":if(typeof a[c]=="undefined"||c!="equals"&&b[c].toString()!=a[c].toString())return!1;break;default:if(b[c]!=a[c])return!1}else if(a[c])return!1;for(c in a)if(typeof b[c]=="undefined")return!1;return!0}var d=ko.utils.unwrapObservable;ko.bindingHandlers.cssNamed={update:function(a,b){var c=ko.utils.unwrapObservable(b()),d=$(a).data("knockoutCssNamed");$(a).removeClass(d||" ").addClass(c).data("knockoutCssNamed",c)}},ko.bindingHandlers.tooltip={init:function(a,b){var c=ko.toJS(b());$(a).tooltip(c)},update:function(a,b){$(a).attr("data-original-title",d(b().title))}},ko.bindingHandlers.popover={init:function(a,b){var c=ko.toJS(b());$(a).popover(c)},update:function(a,b){$(a).attr("data-original-title",d(b().title)),$(a).attr("data-content",d(b().content))}},c.exports={objectEquals:e}}),define("view/undo-button-view",["require","exports","module"],function(a,b,c){function g(){d=$("#undo-btn"),e=$(".action-label",d),i(),d.click(function(){f(),d.hide()})}function h(a,b){d.show(),e.text(a),f=b}function i(){d.hide(),f=null,e.text("")}var d,e,f;c.exports={init:g,show:h,hide:i},g()}),define("view/divider-drag",["require","exports","module"],function(a,b,c){c.exports=function(){function j(a){a>h-b?a=h-b:a<b&&(a=b),i=a,d.outerHeight(a-g/2),e.outerHeight(h-a-g),f.css("top",a),$(".main-area .panel").height(d.innerHeight()-44)}var a=10,b=50,c=$(".main-area"),d=$(".top-panel",c),e=$(".bottom-panel",c),f=$(".divider",c),g=f.outerHeight(),h=c.innerHeight(),i=0;j(h-h/3),f.mousedown(function(){var a=function(a){var b=a.pageY-c.offset().top;return j(b),!1};return $(window).mousemove(a),$(window).mouseup(function(){return $(window).unbind("mousemove",a),!1}),!1}),$(window).resize(function(){var a=i/h;h=c.innerHeight(),j(h*a)})}}),define("model/property",["require","exports","module"],function(a,b,c){var d=c.exports=Backbone.Model.extend({defaults:{required:!0},initialize:function(){this.on("change:optional",function(){this.set({required:!this.get("optional")})},this)},parse:function(a){return a.$renameFrom=a.name,a},toJSON:function(){var a=Backbone.Model.prototype.toJSON.call(this);return a.$renameFrom==a.name&&delete a.$renameFrom,a}})}),define("model/property-collection",["require","exports","module","./property"],function(a,b,c){var d=a("./property"),e=c.exports=Backbone.Collection.extend({model:d,comparator:function(a){return a.get("order")}})}),define("model/collection-settings",["require","exports","module","./property-collection"],function(a,b,c){var d=a("./property-collection"),e=c.exports=Backbone.Model.extend({url:function(){return"/resources/"+this.id},defaults:{properties:null,onGet:"",onPost:'/* Validation */\n// if (this.name.length < 10) {\n//   error("name", "Must be at least 10 characters");\n// }\n\n/* Authentication */\n// if (!me || !me.isAdmin) {\n//   cancel("You must be an admin!", 401);\n// }\n\n/* Automatic properties */\n// this.creator = me._id;\n// this.creatorName = me.name;\n',onPut:'/* Readonly properties */\n// protect("creator");\n',onDelete:""},initialize:function(){this.set({properties:new d}),this.get("properties").on("add",this.triggerChanged,this),this.get("properties").on("remove",this.triggerChanged,this),this.get("properties").on("update",this.triggerChanged,this),this.get("properties").on("change:name",this.triggerChanged,this),this.get("properties").on("change:required",this.triggerChanged,this),this.get("properties").on("change:order",this.triggerChanged,this)},parse:function(a){var b=a.properties;return delete a.properties,this.get("properties").each(function(a){var c=b[a.get("name")];c&&_.each(a.attributes,function(a,b){_.str.startsWith(b,"c_")&&(c[b]=a)})}),b&&this.get("properties").reset(Backbone.Utils.parseDictionary(b,{keyProperty:"name"}),{parse:!0}),a},triggerChanged:function(){this.trigger("change")},toJSON:function(){var a=Backbone.Model.prototype.toJSON.call(this);return a.properties=Backbone.Utils.toJSONDictionary(a.properties.toJSON(),{keyProperty:"name"}),a}})}),define("view/component-type-sidebar-view",["require","exports","module"],function(a,b,c){var d=c.exports=Backbone.View.extend({events:{"click li":"onAddItem"},initialize:function(){this.collection=this.collection||this.options.collection,this.template=this.template||this.options.template,this.listView=this.listView||this.options.listView,this.collection.on("reset",this.render,this)},render:function(){var a=this;$(this.el).html(this.template({types:this.collection})),a.$("li").each(function(){}).popover({placement:"right"})},onAddItem:function(a){var b=$(a.currentTarget).attr("data-cid"),c=this.collection.getByCid(b);this.listView.addItem(c)}})}),define("model/resource",["require","exports","module"],function(a,b,c){var d=c.exports=Backbone.Model.extend({defaults:{path:"",order:0},parse:function(a){return a.$renameFrom=a.path,a},initialize:function(){this.on("change:path",this.sanitizePath,this)},sanitizePath:function(){var a=this.get("path");a=d.sanitizePath(a),a!==this.get("path")&&this.set({path:a})}});d.sanitizePath=function(a){return a=a.toLowerCase().replace(/[ _]/g,"-").replace(/[^a-z0-9\/\-]/g,""),_.str.startsWith(a,"/")||(a="/"+a),a}}),define("model/resource-collection",["require","exports","module","../model/resource"],function(a,b,c){var d=a("../model/resource"),e=c.exports=Backbone.Collection.extend({model:d,url:"/resources",comparator:function(a){return a.get("order")}})}),define("model/resource-type-collection",["require","exports","module","../backbone-utils"],function(a,b,c){a("../backbone-utils");var d=c.exports=Backbone.Collection.extend({url:"/types",sort:function(a){return a.get("label")},parse:function(a){return Object.keys(a).forEach(function(b){b==="Collection"?(a[b].tooltip="Add a simple store to save, update, fetch and delete JSON objects. Available over REST at the specified url.",a[b].tooltipTitle="Persist Data"):b==="UserCollection"?(a[b].tooltip="Add a collection of users such as 'admins', 'authors', or just 'users'. Store users as JSON objects and log them in over REST.",a[b].tooltipTitle="Manage Users"):b==="Static"&&(a[b].tooltip="Add a folder to serve static files such as HTML, CSS, JavaScript, and images.",a[b].tooltipTitle="Serve Files")}),Backbone.Utils.parseDictionary(a)}})}),define("model/property-type-collection",["require","exports","module","../backbone-utils"],function(a,b,c){a("../backbone-utils");var d=c.exports=Backbone.Collection.extend({url:"/property-types",sort:function(a){return a.get("label")},parse:function(a){return Object.keys(a).forEach(function(b){b==="string"?(a[b].tooltip="Add a string property. If the incoming value is not a string it will be rejected.",a[b].tooltipTitle="Arbitrary Text"):b==="number"?(a[b].tooltip="Add a number property. If the incoming value is not a number it will be rejected.",a[b].tooltipTitle="JSON Number"):b==="boolean"?(a[b].tooltip="Add a boolean property. If the incoming value is not 'true' or 'false' it will be rejected.",a[b].tooltipTitle="True or false"):b==="date"&&(a[b].tooltip="Add a date string property. If the incoming value is not a valide date string it will be rejected.",a[b].tooltipTitle="specific point in time")}),Backbone.Utils.parseDictionary(a)}})}),define("model/data-collection",["require","exports","module"],function(a,b,c){var d=c.exports=Backbone.Collection.extend({url:function(){var a=this.path;return this.querystring&&(this.querystring.indexOf("{")==0?a+="?q="+this.querystring:a+="?"+this.querystring),a}})}),define("view-model/property-view-model",["require","exports","module"],function(a,b){function d(a,b){a=_.defaults(a||{},{name:" ",type:"string",typeLabel:"string",optional:!1,required:!0}),a._id=a.name;var d=ko.mapping.fromJS(a,c);return d.editing=ko.observable(!1),d.nameFocus=ko.observable(),d.isNew=b!=null,d.toggleEditing=function(){d.editing(!d.editing()),d.editing()&&d.nameFocus(!0)},d.onClickHeader=function(a,b){return!d.editing()||b.target===b.currentTarget||$(b.target).is("div")?(d.toggleEditing(),!1):!0},d.onNameKeypress=function(a,c){return c.which==13&&setTimeout(function(){d.isNew?b.addProperty():d.editing(!1)},1),!0},d.setType=function(a){d.type(ko.utils.unwrapObservable(a._id)),d.typeLabel(ko.utils.unwrapObservable(a.label)),d.type()==="boolean"&&d.optional(!1)},d}var c={include:["optional","_id","$renameFrom"]};b.create=d}),define("view-model/property-list-view-model",["require","exports","module","../view/undo-button-view","./property-view-model"],function(a,b){function e(){var a={properties:ko.observableArray(),propertyTypes:ko.observableArray()};return a.newProperty=d.create({},a),a.newProperty.nameFocus(!0),a.addProperty=_.bind(function(){this.newProperty.name()&&this.newProperty.type()&&(this.properties.push(d.create(ko.mapping.toJS(this.newProperty))),this.newProperty.name(""))},a),a.removeProperty=_.bind(function(a){var b=this,d=this.properties.indexOf(a);c.show("Delete "+a.name(),function(){b.properties.splice(d,0,a)}),this.properties.remove(a)},a),a.onNewNameKeypress=_.bind(function(b,c){return c.which==13&&setTimeout(function(){a.addProperty()},1),!0},a),a}var c=a("../view/undo-button-view"),d=a("./property-view-model");b.create=e}),define("view/property-list-view",["require","exports","module","../knockout-utils","../app","./undo-button-view","../view-model/property-list-view-model","../view-model/property-view-model"],function(a,b,c){var d=a("../knockout-utils"),e=a("../app"),f=a("./undo-button-view"),g=a("../view-model/property-list-view-model"),h=a("../view-model/property-view-model"),i=c.exports=Backbone.View.extend({el:"#property-list",template:_.template($("#property-list-template").html()),initialize:function(){this.collection=this.collection||this.options.collection,this.typeCollection=this.typeCollection||this.options.typeCollection,this.initializeViewModel(),this.mapProperties(),this.collection.on("reset",this.mapProperties,this),this.mapTypes(),this.typeCollection.on("reset",this.mapTypes,this),this.render()},initializeViewModel:function(){var a=this;this.viewModel=g.create(),this.mapping={properties:{key:function(a){return ko.utils.unwrapObservable(a.name)},create:_.bind(function(a){return h.create(a.data)},this)}},ko.computed(function(){var b=a._lastJSON,c=ko.mapping.toJS(this),e=c.properties;b&&!d.objectEquals(b,e)&&(a.collection.reset(c.properties,{silent:!0}),a.collection.trigger("update"),a._lastJSON=e)},this.viewModel).extend({throttle:100})},mapProperties:function(){var a=this.collection.toJSON();this._lastJSON=a,ko.mapping.fromJS({properties:a},this.mapping,this.viewModel);var b=ko.mapping.toJS(this.viewModel);d.objectEquals(b.properties,a)||(console.log("WARNING: viewmodel/model mismatched. Remapping..."),this.viewModel.properties.removeAll(),setTimeout(_.bind(this.mapProperties,this),1))},mapTypes:function(){ko.mapping.fromJS({propertyTypes:this.typeCollection.toJSON()},this.mapping,this.viewModel)},render:function(){this.el&&ko.cleanNode(this.el),$(this.el).html(this.template({resourceTypeId:e.get("resourceTypeId")})),ko.applyBindings(this.viewModel,this.el)},close:function(){ko.removeNode(this.el)}})}),define("view/property-reference-view",["require","exports","module"],function(a,b,c){var d=c.exports=Backbone.View.extend({el:"#property-reference",template:_.template($("#property-reference-template").html()),initialize:function(){this.render(),this.model.on("change",this.render,this)},render:function(){$(this.el).html(this.template({model:this.model})),this.$("li i").tooltip({placement:"left"})}})}),define("view/status-tooltip",["require","exports","module"],function(a,b,c){c.exports=function(a,b,c,d){d=d||3e3;var e=$("<div>").css("position","absolute").css("z-index",1e3).css("top",c).css("left",b).tooltip({title:a,trigger:"manual"});e.appendTo("body").tooltip("show"),setTimeout(function(){e.tooltip("hide").remove()},d)}}),define("view/collection-data-view",["require","exports","module","./undo-button-view","./status-tooltip","../app"],function(a,b,c){var d=a("./undo-button-view"),e=a("./status-tooltip"),f=a("../app"),g=c.exports=Backbone.View.extend({el:"#current-data",template:_.template($("#model-table-template").html()),events:{"click .add-btn":"addRow","click .delete-btn":"deleteRow","click .edit-btn":"editRow","click .cancel-btn":"cancelEditingRow","dblclick td:not(.id)":"editRow","dblclick .id":"copyId","click .done-btn":"commitRow","keyup input":"onFieldKeypress","dblclick input":"cancelEvent","keyup #current-data-querystring":"changeQuerystring"},initialize:function(){this.properties=this.options.properties,this.collection=this.options.collection,this.properties.on("reset",this.render,this),this.properties.on("add",this.render,this),this.properties.on("remove",this.render,this),this.properties.on("change:name",this.render,this),this.collection.on("reset",this.render,this),this.collection.on("add",this.render,this),this.collection.on("remove",this.render,this),this.collection.on("change",this.render,this),$(this.el).on("focus","input",_.bind(function(a){this._lastFocusedInput=a.currentTarget},this)),this.$("#current-data-querystring").tooltip({animation:!1,placement:"left",trigger:"focus"}),this.collection.on("error",function(a,b,c){var d="Error!";try{d=JSON.parse(b.responseText).message}catch(e){}this.$("#current-data-querystring").attr("data-original-title",d).tooltip("fixTitle").tooltip("show")},this),this.collection.on("reset",function(){this.$("#current-data-querystring").attr("data-original-title","").tooltip("fixTitle").tooltip("hide")},this);var a=this.collection,b=this;this._interval=setInterval(function(){a&&!b.editing&&a.fetch()},1e3)},save:function(a){this.editing=!1,this.collection.each(function(a){var b=new jQuery.Deferred;a.get("c_delete")?a.destroy({success:b.resolve,error:b.reject}):a.get("c_save")&&a.save({},{success:b.resolve,error:b.reject})}),jQuery.when.call(jQuery,deferreds).done(a)},addRow:function(){this.editing=!0;var a=new Backbone.Model({c_active:!0,c_save:!0});return this.collection.add(a),setTimeout(function(){this.$('tr[data-cid="'+a.cid+'"] input').first().focus()},0),!1},deleteRow:function(a){this.editing=!1;var b=this._getRow(a),c=this.collection.indexOf(b);return b.destroy(),b.unset("_id"),d.show("Delete row",_.bind(function(){this.collection.create(b.toJSON())},this)),!1},copyId:function(a){var b=this._getRow(a);return prompt("Copy the id to your clipboard:",b.id),!1},editRow:function(a){var b=this._getRow(a);b.set({c_active:!0}),this.editing=!0;if($(a.currentTarget).is("td")){var c=$(a.currentTarget).attr("data-prop");setTimeout(function(){this.$('tr[data-cid="'+b.cid+'"] td[data-prop="'+c+'"] input').first().focus()},0)}else setTimeout(function(){this.$('tr[data-cid="'+b.cid+'"] input').first().focus()},0);return!1},commitRow:function(a){var b=this._getRow(a),c={};if(f.get("resourceTypeId")==="UserCollection"){c.email=$(a.currentTarget).parents("tr").find('input[name="email"]').val();var d=$(a.currentTarget).parents("tr").find('input[name="password"]').val();d&&(c.password=d)}return this.properties.each(function(b){var d=b.get("name"),e=b.get("type"),f=$(a.currentTarget).parents("tr").find('input[name="'+d+'"]'),g=f.val();e==="number"?g=parseInt(g):e==="boolean"&&(g=f.is(":checked")),c[d]=g}),this.saveRow(b,c),!1},cancelEditingRow:function(a){var b=this._getRow(a);return b.isNew()?b.destroy():b.fetch({success:function(){b.set({c_active:!1}),self.editing=!1}}),!1},saveRow:function(a,b){var c=this;a.save(b,{success:function(){c.editing=!1,a.set({c_active:!1})},error:function(b,c,d){var e;try{e=JSON.parse(c.responseText)}catch(f){e={}}e.errors?a.set({c_errors:e.errors}):alert("An error occured while saving: "+c.responseText)}})},updateField:function(a){var b=this._getRow(a),c=$(a.currentTarget).attr("name"),d=$(a.currentTarget).val(),e={};return e[c]=d,b.set(e),!1},cancelEvent:function(){return!1},changeQuerystring:function(){this.collection.querystring=this.$("#current-data-querystring").val()},onFieldKeypress:function(a){a.which===13?this.commitRow(a):a.which===27&&this.cancelEditingRow(a)},render:function(){this.$("table").html(this.template({properties:this.properties.toJSON(),collectionModel:this.collection,resourceType:f.get("resourceTypeId")})),this.$(".error-tooltip").tooltip()},_getRow:function(a){var b=$(a.currentTarget);if(!b.is("tr"))var b=b.parents("tr");return this.collection.getByCid(b.attr("data-cid"))},close:function(){Backbone.View.prototype.close.call(this),clearInterval(this._interval)}})}),define("view/code-editor-view",["require","exports","module"],function(a,b,c){var d=ace.require("ace/mode/javascript").Mode,e=ace.require("ace/mode/css").Mode,f=ace.require("ace/mode/html").Mode,g=c.exports=Backbone.View.extend(Backbone.Events).extend({initialize:function(){this.mode=this.options.mode,_.bindAll(this,"trackUpdate","update","render")},trackUpdate:function(){this._timeout&&clearTimeout(this._timeout);var a=this.updateTime||1e3;this._timeout=setTimeout(this.update,a)},update:function(){this.trigger("change")},getText:function(){return this.editor.getSession().getValue()},setText:function(a){this.editor.getSession().setValue(a),clearTimeout(this._timeout)},resize:function(){this.editor.resize()},render:function(){var a=this,b=ace.edit(this.el),c=this.mode||"js";return c==="html"||c==="htm"?b.getSession().setMode(new f):c==="css"?b.getSession().setMode(new e):c==="js"&&b.getSession().setMode(new d),b.getSession().on("change",this.trackUpdate),b.commands.addCommand({name:"save",bindKey:{win:"Ctrl-S",mac:"Command-S"},exec:function(b){a.trigger("save")}}),this.editor=b,this}})}),define("view/collection-event-view",["require","exports","module","./code-editor-view"],function(a,b,c){var d=a("./code-editor-view"),e=c.exports=Backbone.View.extend({template:_.template($("#events-template").html()),events:{"shown .nav-tabs a":"resize"},initialize:function(){this._editors={onGet:null,onPost:null,onPut:null,onDelete:null}},update:function(a){var b={};_.each(this._editors,function(a,c){a&&(b[c]=a.getText())}),this.model.set(b)},render:function(){var a=this;return this._resizeInterval=setInterval(_.bind(this.resize,this),100),$(this.el).html(this.template(this.model.toJSON())),_.each(this._editors,function(b,c){b&&b.off(),b=(new d({el:a.$("#"+c)})).render(),b.on("change",a.update,a),a._editors[c]=b}),this},resize:function(a){},close:function(){clearInterval(this._resizeInterval),_.each(this._editors,function(a,b){a&&a.off()})}})}),define("view/collection-routes-view",["require","exports","module"],function(a,b,c){var d=c.exports=Backbone.View.extend({el:"#api",template:_.template($("#collection-routes-template").html()),initialize:function(){this.render(),this.model.on("change",this.render,this)},render:function(){$(this.el).html(this.template(this.model.toJSON()))}})}),define("model/file",["require","exports","module","../app"],function(a,b,c){var d=a("../app"),e=c.exports=Backbone.Model.extend({url:function(){var a=this.get("info"),b=this.get("path");return a?b+"/"+a.fileName:b},sync:function(a,b,c){function g(){}var e=this,f=arguments,h=b.get("info"),i=b.get("data");if(a==="create"&&(h||i)){var j;if(h)j=new FormData,j.append("data",h);else if(i||i==="")j=i;var k=_.isFunction(b.url)?b.url():b.url;k=d.get("appUrl")+k;var l=new XMLHttpRequest;l.open("POST",k),l.setRequestHeader("x-dssh-key",d.get("authKey")),l.send(j),l.addEventListener("readystatechange",function(){typeof c.success=="function"&&c.success(),e.trigger("sync")})}else Backbone.sync.apply(b,f)}})}),define("view/static-view",["require","exports","module","../app","../model/file"],function(a,b,c){function i(a){return h[j(a)]}function j(a){if(!a)return;var b=-1,c=0;while(c<(a?a.length:0))a[c++]==="."&&(b=c);return a.substr(b,a.length)}var d=a("../app"),e=a("../model/file"),f=_.template($("#file-template").html()),g=c.exports=Backbone.View.extend({events:{"change #file-upload input":"onChange","click .new-file-btn":"addFile","click a.delete":"delete"},initialize:function(){this.list=this.$("#files tbody"),this.files=new Backbone.Model,this.files.parse=function(a){return{all:a}},this.files.url=this.model.get("path"),this.files.on("change:all",this.render,this),this.files.fetch()},render:function(a,b,c){var e=this.list,g="",a=this.model,h=a.get("path");return h==="/"&&(h=""),b&&_.each(b.reverse(),function(a){g+=f({filename:a,url:d.get("appUrl")+h+"/"+a,path:h+"/"+a,isEditable:i(a)})}),this.files.get("all")&&this.files.get("all").length?($("#files").show(),$("#files-empty").hide()):($("#files").hide(),$("#files-empty").show()),e.html(g),this},onChange:function(a){var b=a.target.files&&a.target.files,c=this.model.get("path"),d=this;_.each(b,function(a){var b=new e({info:a,path:c}),f=$("<div>").text("Uploading "+a.fileName+"...").appendTo(d.$("#currentUploads"));b.on("sync",function(){d.files.fetch(),f.fadeOut(500,function(){f.remove()})}),b.save()})},"delete":function(a){var b=$(a.currentTarget).attr("filename"),c=new e({path:this.model.get("path"),info:{fileName:b},_id:b}),d=this.files;return c.destroy({success:function(){d.fetch()}}),!1},addFile:function(){var a=prompt("Enter a name for this file, including the extension:"),b=this.files.url;return b==="/"?b="":b=b.slice(1)+"/",a&&d.set("edit",b+a),!1}}),h={}}),define("view/header-view",["require","exports","module","../model/resource","./save-status-view","./undo-button-view"],function(a,b,c){var d=a("../model/resource"),e=a("./save-status-view"),f=a("./undo-button-view"),g=c.exports=Backbone.View.extend({el:"#header",template:_.template($("#header-template").html()),events:{"click .resourceName":"rename"},initialize:function(){this.model.on("change",this.render,this)},rename:function(){var a=this.model.get("resource"),b=prompt("Enter a new name for this "+a.get("type"),a.get("path"));return b&&(b=d.sanitizePath(b),a.save({path:b,$renameFrom:a.get("path")}),this.model.set("resourceName",b)),!1},render:function(){return $(this.el).html(this.template(this.model.toJSON())),e.init(!0),f.init(),this}})}),define("view/file-editor-view",["require","exports","module","../app","../model/file","./code-editor-view"],function(a,b,c){var d=a("../app"),e=a("./code-editor-view"),f=a("../model/file"),g=a("./save-status-view"),h=c.exports=Backbone.View.extend(Backbone.Events).extend({events:{"click .back":"back","click #save-btn":"save"},initialize:function(){var a=this.path="/"+d.get("edit"),b=this,c=a.slice(a.indexOf(".")+1),f=this.editor=(new e({el:$("#editor"),mode:c})).render();f.updateTime=1,_.bind(b.save,b),f.on("save",function(){b.save()}),f.on("change",function(){b.hasChanges()}),$.get(a,function(a){f.setText(a)}),b.saved()},back:function(){return d.unset("edit"),!1},save:function(){var a=new f({path:this.path,data:this.editor.getText()});a.save({},{success:function(){g.saved()}}),this.saved(),g.saving()},hasChanges:function(){$("#file-status").empty().append('<i class="icon-file"></i> '+this.link()+' <i class="icon-asterisk"></i>'),$("#save-btn").removeAttr("disabled")},link:function(){return'<a href="'+this.path+'" target="_blank">'+this.path+"</a>"},saved:function(){$("#file-status").empty().append('<i class="icon-file"></i> '+this.link()),$("#save-btn").attr("disabled",!0)}})}),define("router",["require","exports","module","./app"],function(a,b,c){var d=a("./app"),e=Backbone.Router.extend({routes:{"":"home",":id":"resource","edit/*path":"edit"},home:function(){d.set({resourceId:"",resourceName:undefined,resourceType:undefined,edit:undefined})},resource:function(a){d.set({resourceId:a,edit:undefined})},edit:function(a){d.set({edit:a})}});c.exports=new e}),define("view/resource-view",["require","exports","module","./undo-button-view","../router"],function(a,b,c){var d=a("./undo-button-view"),e=a("../router"),f=_.template($("#resource-template").html()),g=c.exports=Backbone.View.extend({tagName:"li",className:"component-item",events:{"click .delete-btn":"delete","click .component-item-header":"onClickHeader","click .path":"activate","click .rename-btn":"activate","click .cancel-btn":"deactivate","click .save-btn":"save",'keypress input[name="path"]':"onKeypress",'keyup input[name="path"]':"onKeyup"},initialize:function(){this.parentView=this.options.parentView,this.model.on("change:c_active",this.render,this),this.model.on("change:_id",this.render,this),this.model.on("change:path",this.render,this)},render:function(){var a=$(this.el);return a.attr("id",this.model.cid).html(f({resource:this.model.toJSON()})),this.model.isNew()?a.addClass("unsaved"):a.removeClass("unsaved"),this},gotoDetail:function(){return this.model.isNew()||e.navigate(this.model.get("_id"),{trigger:!0}),!1},"delete":function(){var a=this;return a.model.isNew()?a.model.destroy():confirm("Do you wish to delete this resource? All associated data and configuration will be permanently removed.")&&a.model.destroy({wait:!0}),!1},activate:function(){return this.model.set({c_active:!0}),this.$('input[name="path"]').focus(),!1},deactivate:function(){return this.model.isNew()?this.delete():this.model.set({c_active:!1}),!1},save:function(){return this.model.save({path:this.$('input[name="path"]').val()}),this.model.set({c_active:!1}),!1},onClickHeader:function(a){if($(a.target).hasClass("component-item-header"))return this.model.get("c_active")?this.deactivate():this.gotoDetail(),!1;this.onFocus(a)},onFocus:function(a){$(a.target).focus()},onKeypress:function(a){var b=$(a.currentTarget).val();_.str.startsWith(b,"/")||(b="/"+b,$(a.currentTarget).val(b))},onKeyup:function(a){a.which==13&&(this.model.isNew()?this.model.save({path:this.$('input[name="path"]').val()},{success:_.bind(function(){this.gotoDetail()},this)}):this.save()),a.which==27&&this.deactivate()},destroy:function(){this.model.off("change:c_active",this.render),this.model.off("change:_id",this.render),this.model.off("change:path",this.render)}})}),define("view/resource-list-view",["require","exports","module","../model/resource","./resource-view"],function(a,b,c){var d=a("../model/resource"),e=a("./resource-view"),f=c.exports=Backbone.View.extend({el:"#resource-list",emptyEl:"#resource-list-empty",subViews:[],initialize:function(){this.parentView=this.options.parentView,this.collection=this.options.collection,this.typeCollection=this.options.typeCollection,this.collection.on("reset",this.render,this),this.collection.on("add",this.render,this),this.collection.on("remove",this.render,this),this.initializeDom()},initializeDom:function(){$(this.el).sortable({revert:!1,placeholder:"placeholder",cancel:".placeholder",distance:10,receive:_.bind(function(){if($(this.el).is(":visible")){var a=$($(this.el).data().sortable.currentItem),b=$(this.el).children(":not(.placeholder)").index(a);this.onReceiveComponent(a,b)}},this),update:_.bind(this.onReorder,this)}),$(".placeholder",this.emptyEl).droppable({hoverClass:"highlight",drop:_.bind(function(a,b){if(this.collection.length===0){var c=$(b.helper);this.onReceiveComponent(c)}},this)})},addItem:function(a,b){isNaN(b)&&(b=this.collection.length);var c=new d({path:a.get("defaultPath"),typeLabel:a.get("label"),type:a.get("_id"),order:b+1,c_active:!0});return this.collection.add(c,{at:b}),this.updateOrder(),setTimeout(function(){this.$("#"+c.cid).find('input[name="path"]').focus()},0),!1},updateOrder:function(){var a=this,b=[];$(this.el).children().each(function(){var c=a.collection.getByCid($(this).attr("id"));c&&b.push(c)});var c=0;_.each(b,function(a){c+=1,a.isNew()?a.set({order:c},{silent:!0}):a.save({order:c},{silent:!0})})},onReceiveComponent:function(a,b){var c=a.attr("data-cid"),d=this.parentView.resourceTypes.getByCid(c);a.remove(),this.addItem(d,b)},onReorder:function(){this.updateOrder()},render:function(a){var b=this;_.each(b.subViews,function(a){a.destroy()}),$(b.el).empty(),b.collection.length?($(b.el).show(),$(b.emptyEl).hide(),b.subViews=b.collection.map(function(a){var c=new e({model:a,parentView:b});return $(b.el).append(c.el),c.render(),c})):($(b.el).hide(),$(b.emptyEl).show())}})}),define("view/resources-view",["require","exports","module","./component-type-sidebar-view","./resource-list-view","../model/resource-collection","../model/resource-type-collection"],function(a,b,c){var d=a("./component-type-sidebar-view"),e=a("./resource-list-view"),f=a("../model/resource-collection"),g=a("../model/resource-type-collection"),h=c.exports=Backbone.View.extend({el:"body",typesTemplate:_.template($("#resource-types-template").html()),events:{"click #property-types a":"addItem"},initialize:function(){this.resourceTypes=new g,this.resources=new f,this.resourceListView=new e({collection:this.resources,typeCollection:this.resourceTypes,parentView:this}),this.resourceTypes.on("reset",this.renderTypes,this),this.resourceTypes.fetch(),this.resources.fetch()},addItem:function(a){var b=$(a.currentTarget).parents("li").attr("data-cid"),c=this.resourceTypes.getByCid(b);this.resourceListView.addItem(c)},renderTypes:function(){$("#property-types").html(this.typesTemplate({types:this.resourceTypes})).find("li").popover({placement:"left"})}})}),define("view/collection-view",["require","exports","module","../model/property-type-collection","../model/collection-settings","../model/data-collection","./property-list-view","./property-reference-view","./collection-data-view","./collection-event-view","./collection-routes-view","../app","../router","./undo-button-view"],function(a,b,c){var d=a("../model/property-type-collection"),e=a("../model/collection-settings"),f=a("../model/data-collection"),g=a("./property-list-view"),h=a("./property-reference-view"),i=a("./collection-data-view"),j=a("./collection-event-view"),k=a("./collection-routes-view"),l=a("../app"),m=a("../router"),n=a("./undo-button-view"),o=c.exports=Backbone.View.extend({events:{"click .cta-link":"onClickCta"},initialize:function(){this.propertyTypes=new d,this.dataCollection=new f([]),this.dataCollection.path=this.model.get("path"),this.dataCollection.fetch(),this.model.on("change:path",function(){this.dataCollection.path=this.model.get("path")},this),this.propertyListView=new g({collection:this.model.get("properties"),typeCollection:this.propertyTypes,parentView:this}),this.PropertyReferenceView=new h({model:this.model}),this.dataView=new i({properties:this.model.get("properties"),collection:this.dataCollection}),this.routesView=new k({model:this.model}),this.eventsView=(new j({el:this.$("#events-panel"),model:this.model})).render(),this.model.on("change",this.save,this),this.dataCollection.on("reset",this.render,this),this.model.on("change",this.render,this),this.propertyTypes.fetch(),this.initializeDom(),this.render()},initializeDom:function(){this.onKeypress=_.bind(this.onKeypress,this),$(".icon-info-sign").popover(),this._navSections=navSections=[],this.onScroll=_.bind(this.onScroll,this),$(window).on("scroll",this.onScroll),this.onScroll(),this.model.get("properties").length&&this.$('#page-nav a[href="#data"]').click()},save:function(){var a=this;this.model.save()},onKeypress:function(a){if((a.ctrlKey||a.metaKey)&&a.which=="83")return this.save(),a.preventDefault(),!1},onScroll:function(a){},onClickCta:function(a){var b=$(a.currentTarget).attr("href"),c=$('#page-nav a[href="'+b+'"]');return c.click(),!1},navigate:function(a){var b=$(a.currentTarget),c=b.attr("href");return $(window).scrollTop($(c).offset().top-50),!1},render:function(){var a=$("#property-now-what");return this.model.get("properties").length&&!this.dataCollection.length?a.show():a.hide(),this},close:function(){Backbone.View.prototype.close.call(this),this.propertyListView.close(),this.dataView.close(),this.eventsView.close(),$(window).off("scroll",this.onScroll)}})}),define("view/app-view",["require","exports","module","../model/collection-settings","./resources-view","./collection-view","./static-view","./header-view","./file-editor-view","./undo-button-view","./save-status-view","../app","../router","./divider-drag"],function(a,b,c){var d=a("../model/collection-settings"),e=a("./resources-view"),f=a("./collection-view"),g=a("./static-view"),h=a("./header-view"),i=a("./file-editor-view"),j=a("./undo-button-view"),k=a("./save-status-view"),l=a("../app"),m=a("../router"),n=c.exports=Backbone.View.extend({headerTemplate:_.template($("#header-template").html()),resourcesTemplate:_.template($("#resources-template").html()),collectionTemplate:_.template($("#collection-template").html()),staticTemplate:_.template($("#static-template").html()),fileEditorTemplate:_.template($("#file-editor-template").html()),events:{"click #authModal .save":"authenticate"},initialize:function(){this.model=this.model||l,this.model.on("change:resourceId",this.loadResource,this),this.model.on("change:resource",this.render,this),this.model.on("change:edit",this.render,this),this.headerView=new h({model:l}),this.$modal=$("#authModal").modal();var a=location.protocol+"//"+location.host;l.set({appUrl:a,authKey:$.cookie("DPDAuthKey")}),l.get("appUrl")&&l.get("authKey")?this.$modal.modal("hide"):this.$modal.on("click",".save",_.bind(this.authenticate,this))},authenticate:function(){return l.set({authKey:this.$modal.find("[name=key]").val()}),$.cookie("DPDAuthKey",l.get("authKey"),{expires:7}),this.$modal.modal("hide"),this.render(),!1},loadResource:function(){var a=this;if(this.model.get("resourceId")){var b=new Backbone.Model({_id:a.model.get("resourceId")});b.url="/resources/"+b.id,b.fetch({success:function(){var c=new d;l.set({resourceName:b.get("path"),resourceType:b.get("typeLabel"),resourceTypeId:b.get("type")}),c.set(c.parse(b.attributes)),a.model.set({resource:c})}})}else a.model.set({resource:null})},render:function(){var b=this.model.toJSON(),c,d,h=this.model&&this.model.get("resourceId"),n=this.model&&h&&this.model.get("resourceTypeId"),o=this.model&&this.model.get("edit")||!1;o?(c=this.fileEditorTemplate,d=i):n==="Collection"||n==="UserCollection"?(c=this.collectionTemplate,d=f):n==="Static"?(c=this.staticTemplate,d=g):(l.set({resourceType:""}),l.set({resourceName:""}),c=this.resourcesTemplate,d=e);var p=$('<div id="body">').html(c(b));$("#body").replaceWith(p),a("./divider-drag")(),$(window).resize(),this.bodyView&&this.bodyView.close(),this.bodyView=new d({el:p,model:this.model.get("resource")}),this.bodyView.render(),j.init(),k.init(),o?m.navigate("/edit/"+o):m.navigate(this.model.get("resourceId"))}})}),define("entry",["require","exports","module","./backbone-utils","./knockout-utils","./view/undo-button-view","./view/divider-drag","./view/app-view","./router"],function(a,b,c){a("./backbone-utils"),a("./knockout-utils"),a("./view/undo-button-view"),a("./view/divider-drag");var d=a("./view/app-view"),e=a("./router"),f=new d;Backbone.history.start()})