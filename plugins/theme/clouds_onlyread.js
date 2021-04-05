ace.define("ace/theme/clouds_onlyread",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-clouds-onlyread";
exports.cssText = ".ace-clouds-onlyread .ace_gutter {\
background: #F5F5F5;\
color: #757575\
}\
.ace-clouds-onlyread .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-clouds-onlyread {\
background-color: #F5F5F5;\
color: #999\
}\
.ace-clouds-onlyread .ace_cursor {\
color: #00000000\
}\
.ace-clouds-onlyread .ace_marker-layer .ace_selection {\
background: #BDD5FC\
}\
.ace-clouds-onlyread.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
}\
.ace-clouds-onlyread .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0)\
}\
.ace-clouds-onlyread .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #BFBFBF\
}\
.ace-clouds-onlyread .ace_marker-layer .ace_active-line {\
background: #F5F5F5\
}\
.ace-clouds-onlyread .ace_gutter-active-line {\
background-color: #F5F5F5\
}\
.ace-clouds-onlyread .ace_marker-layer .ace_selected-word {\
border: 1px solid #BDD5FC\
}\
.ace-clouds-onlyread .ace_invisible {\
color: #BFBFBF\
}\
.ace-clouds-onlyread .ace_keyword,\
.ace-clouds-onlyread .ace_meta,\
.ace-clouds-onlyread .ace_support.ace_constant.ace_property-value {\
color: #07a\
}\
.ace-clouds-onlyread .ace_identifier {\
color: #000000\
}\
.ace-clouds-onlyread .ace_keyword.ace_operator {\
color: #9a6e3a\
}\
.ace-clouds-onlyread .ace_keyword.ace_other.ace_unit {\
color: #96DC5F\
}\
.ace-clouds-onlyread .ace_constant.ace_language {\
color: #905\
}\
.ace-clouds-onlyread .ace_constant.ace_numeric {\
color: #905\
}\
.ace-clouds-onlyread .ace_constant.ace_character.ace_entity {\
color: #BF78CC\
}\
.ace-clouds-onlyread .ace_invalid {\
background-color: #FF002A\
}\
.ace-clouds-onlyread .ace_fold {\
background-color: #AF956F;\
border-color: #000000\
}\
.ace-clouds-onlyread .ace_storage,\
.ace-clouds-onlyread .ace_support.ace_class,\
.ace-clouds-onlyread .ace_support.ace_function,\
.ace-clouds-onlyread .ace_support.ace_other,\
.ace-clouds-onlyread .ace_support.ace_type {\
color: #690\
}\
.ace-clouds-onlyread .ace_string {\
color: #690\
}\
.ace-clouds-onlyread .ace_paren.ace_lparen,\
.ace-clouds-onlyread .ace_paren.ace_rparen {\
color: #999\
}\
.ace-clouds-onlyread .ace_comment {\
color: #708090\
}\
.ace-clouds-onlyread .ace_entity.ace_name.ace_tag,\
.ace-clouds-onlyread .ace_entity.ace_other.ace_attribute-name {\
color: #606060\
}\
.ace-clouds-onlyread .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y\
}";

var dom = acequire("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
