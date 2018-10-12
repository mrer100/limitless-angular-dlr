Array.prototype.exist = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

if (angular) {

	angular.module("app")
	.factory("gtString", [
		"$http",
		function ($http) {
			var vm = this;
			var result = {};

			result.isNull = function (value) {
				return (
					typeof value === "undefined" ||
					typeof value === "NaN" ||
					typeof value === "nan" ||
					value === "NaN" ||
					(value === undefined || value === null) ||
					value == "null"
					);
			};
			result.isEmpty = function (source) {
				if (result.isNull(source)) return true;
				return S(source).isEmpty();
			};
			result.isNullOrEmpty = function (value) {
				return result.isNull(value) || result.isEmpty(value);
			};
			result.firstUp = function (value) {
				return S(value).capitalize();
			};
			result.countWords = function (value, word) {
				return S(value).count(word);
			};
			result.length = function (value, word) {
				return S(value).length;
			};
			result.remove = function (source, value) {
				if (Array.isArray(value)) {
					for (var i = 0; i < value.length; i++) {
						var item = value[i];
						source = S(source).strip(item).s;
					}
					return source;
				} else {
					return S(source).strip(value).s;
				}
			};
			result.equals = function (source, value) {
				return (
					typeof source == "string" &&
					typeof value == "string" &&
					source.toLowerCase().trim() === value.toLowerCase().trim()
					);
			};
			result.containsPattern = function (text, separator, value) {
				if (result.isNullOrEmpty(text)) text = "image/*,application/pdf";
				var collection = text.split(separator);
				for (var i = 0; i < collection.length; i++) {
					var item = collection[i];
					if (result.equals(item, "image/*")) item = "image";
					if (result.contains(value, item)) {
						return true;
					}
				}
				return false;
			};
			result.equalStrict = function (source, value) {
				return (
					typeof source == "string" &&
					typeof value == "string" &&
					source.toLowerCase().trim() === value.toLowerCase().trim()
					);
			};
			result.contains = function (source, value) {
				return S(source).contains(value);
			};
			result.truncate = function (source, max, tail) {
				if (result.isNull(tail)) {
					tail = "";
				}
				if (source == null || source == "") {
					source = "";
				} else {
					if (source.length > max) {
						source = source.slice(0, max) + tail;
					}
				}
				return source;
			};

			result.toLower = function (value) {
				return value.toLowerCase().trim();
			};
			result.capitalizeFirstLetter = function (value) {
				return result.firstUp(result.toLower(value)).s;
			};
			result.toString = function (value) {
				return new String(value);
			};
			return result;
		}
		])
	.factory("gtMath", [
		"$http",
		"gtString",
		function ($http, gtString) {
			var vm = this;
			var result = {};
			result.number = function (value) {
				return Number(value);
			};
			result.decimal = function (value) {
				var toDecimal = Number(Number(Math.round(value * 100) / 100));
				return (Math.round(toDecimal * 100) / 100).toFixed(2);
			};
			result.isNumber = function (value) {
				if (gtString.isNullOrEmpty(value)) return false;
				else {
					var number = result.number(value);
					if (isNaN(number)) return false;
					return !gtString.isNullOrEmpty(number);
				}
			};
			return result;
		}
		])
	.factory("gtObject", [
		"$http",
		"gtString",
		"gtMath",
		function (http, gtString, gtMath) {
			var vm = this;
			var result = {};
			result.isNull = function (value) {
				return gtString.isNull(value);
			};
			result.isValidId = function (value) {
				return !gtString.isEmpty(value) && parseInt(value) > 0;
			};
			result.toggle = function (obj, value) {
				obj[value] = !obj[value];
			};
			result.isObject = function (o) {
				return o instanceof Object;
			};
			result.isFunction = function (fn) {
				return $.isFunction(fn);
			};
			result.serialize = function (obj) {
				return JSON.stringify(obj);
			};
			result.desSerialize = function (obj) {
				return JSON.parse(obj);
			};
			result.resultParent = function () {
				return result._resultParent;
			}
			result.getVmParent = function (initParent, object) {
				if (!result.isNull(initParent.vm[object])) {
					result._resultParent = initParent.vm;
					return initParent.vm[object];
				} else {
					return result.getVmParent(initParent["$parent"], object);

				}

			}
			result.factory = function (type) {
				var factory = new Object();
				this[type] = factory;
				return factory;
			};
			result.whenReady = function (options) {
				var _interval = null;
				return new Promise(function (resolve, reject) {
					_interval = setInterval(function () {
						if (!result.isNull(options.object[options.property])) {
							clearInterval(_interval);
							resolve();
						}
					}, 1000);
				})

			}
			result.isEmpty = function (value) {
				return $.isEmptyObject(value);
			};
			result.isArray = function (value) {
				return Array.isArray(value);
			};
			result.isBoolean = function (value) {
				return (!gtString.isNull(value) &&
					!gtString.isNullOrEmpty(value) &&
					typeof value === "boolean"
					);
			};
			result.clearValues = function (o, deleteArrays) {
				if (!result.isFunction(o) && result.isArray(o)) {
					if (result.isBoolean(deleteArrays) && deleteArrays) {
						o = new Array();
					} else {
						for (var i = 0; i < o[k].length; i++) {
							o = result.clearValues(o, deleteArrays);
						}
					}
				} else {
					for (var k in o) {
						if (!result.isFunction(o[k])) {
							if (result.isBoolean(o[k])) o[k] = false;
							else if (result.isArray(o[k])) {
								if (result.isBoolean(deleteArrays) && deleteArrays) {
									o[k] = new Array();
								} else {
									for (var i = 0; i < o[k].length; i++) {
										o[k] = result.clearValues(o[k], deleteArrays);
									}
								}
							} else if (result.isObject(o[k])) {
								o[k] = result.clearValues(o[k], deleteArrays);
							} else {
								o[k] = "";
							}
						}
					}
				}
				return o;
			};
			result.toIdValid = function (value) {
				return gtMath.number(value);
			};
			result.extend = function (obj1, obj2) {
				return $.extend(obj1, obj2);
			};
			result.clone = function (object) {
				if (result.isNull(object))
					return null;

                    let objCopy = {}; // objCopy will store a copy of the mainObj
                    let key;

                    for (key in object) {
                        objCopy[key] = object[key]; // copies each property to the objCopy object
                    }
                    return objCopy;
                }
                return result;
            }
            ])
			.factory("gtUI", [
	            "gtString",          
	            "$location",            
	            "$sce",
	            "$window",
	            'gtPlataform',           
	            function (
	                gtString,               
	                location,    
	                $sce,
	                $window,
					gtPlataform
	            ) {               

                var vm = this;
                var result = {noty:{}};
            
              	result.blockPanel = function (tag) {
                    $(tag).block({
                        message: '<i class=" icon-spinner4 spinner"></i>',
                        overlayCSS: {
                            backgroundColor: "#fff",
                            opacity: 0.8,
                            cursor: "wait",
                            "box-shadow": "0 0 0 1px #ddd"
                        },
                        css: {
                            border: 0,
                            padding: 0,
                            backgroundColor: "none"
                        }
                    });
                };
                result.unBlockPanel = function (tag) {
                    $(tag).unblock();
                };
               
                result.redirect = function (path, value) {
                	var androidURL="file:///android_asset/www/testbackend";
                	var webURL = "file:///C:/Users/jfsos/Desktop/Android/FireBusinessJS/app/src/main/assets/www/testbackend";
                	var URL = "";
                	if (gtPlataform.currentBrowserIsWebview()) 
						URL = androidURL; 
					else URL = webURL;
                	
                	URL =URL+path;

                	
					window.location.href = URL;
                	/*
                    if (value != null) {                    	
                        location.path(path).search(value);
                    } else {
                        location.path(path);
                    }*/
                };
                result.scrollUp = function () {
                    $("html, body").animate({
                        scrollTop: $("body").offset().top
                    },
                        1000
                    );
                };
                result.urlParam = function (name) {
                    if (!gtObject.isNull(location.$$search[name]))
                        return location.$$search[name];
                    else null;
                };
                result.urlContain = function (value) {
                    return gtString.contains(location.path(), value);
                };
                result.urlEquals = function (value) {
                    return gtString.equalStrict(result.url(), value);
                };           
                result.generateId = function () {
                    return (
                        "_" +
                        Math.random()
                            .toString(36)
                            .substr(2, 9)
                    );
                };

                return result;
            }
        ])
	.factory("gtPlataform", [   
    	"$http",
        "$location","gtObject",
         function (               
                $http,
                location,
                gtObject
            ) {
                var vm = this;
                var result = {};
            
                result.currentBrowserIsWebview = function(){
                	var result = false;
                	try {
						    
							result = !gtObject.isNull(Android);
						} catch (e) {
						 	result = false;
						}
               		return result;
				}
              

                return result;
            }
        ])           
	.factory("gtMessage", [   
    	"$http"
        ,"gtObject",
         function (               
                $http,                
                gtObject
            ) {
                var vm = this;
                var result = {noty:{}};
            
              	function showNoty(text,type,layout,button,){
					noty({
			            width: 200,
			            text: text,
			            type:type,
			            dismissQueue: true,
			            timeout: 4000,
			            layout: layout,			          
        			});
              	}
              	result.noty.error=function(text,layout){
              		showNoty(text,'error',layout,false);
              	}
              	result.noty.success=function(text,layout){
					showNoty(text,'success',layout,false);
              	}
              	result.noty.warning=function(text,layout){
              		showNoty(text,'warning',layout,false);
              	}
              	result.noty.information=function(text,layout){
              		showNoty(text,'information',layout,false);

              	}
              	result.noty.alert=function(text,layout){
              		showNoty(text,'alert',layout,false);
              	}

                return result;
            }
        ])        
	

}