"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var lodash_1 = require("lodash");
/**
 *
 * @param element
 * @return {number}
 */
function getInnerWidth(element) {
    var cs = window.getComputedStyle(element);
    return (element.offsetWidth -
        (parseFloat(cs.paddingLeft) +
            parseFloat(cs.paddingRight) +
            parseFloat(cs.borderLeftWidth) +
            parseFloat(cs.borderRightWidth)));
}
exports.getInnerWidth = getInnerWidth;
/**
 *
 * @param element
 * @return {number}
 */
function getInnerHeight(element) {
    var cs = window.getComputedStyle(element);
    return (element.offsetHeight -
        (parseFloat(cs.paddingTop) +
            parseFloat(cs.paddingBottom) +
            parseFloat(cs.borderTopWidth) +
            parseFloat(cs.borderBottomWidth)));
}
exports.getInnerHeight = getInnerHeight;
/**
 *
 * @param element
 * @return {number}
 */
function getOuterWidth(element) {
    return element.offsetWidth;
}
exports.getOuterWidth = getOuterWidth;
/**
 *
 * @param element
 * @return {number}
 */
function getOuterHeight(element) {
    return element.offsetHeight;
}
exports.getOuterHeight = getOuterHeight;
/**
 * 그리드 colGroup의 width 값을 처리 하는 함수. 왜? '*', '%'로 된 값은 상대적인 값이기 때문에. 컨테이너의 너비에 따라 재계산이 필요합니다.
 * @method
 * @param _colGroup
 * @param options
 * @param container
 * @return {any}
 */
function setColGroupWidth(_colGroup, container, options) {
    var totalWidth = 0, computedWidth, autoWidthColGroupIndexs = [], i, l;
    _colGroup.forEach(function (col, ci) {
        if (lodash_1.isNumber(col.width)) {
            totalWidth += col._width = col.width;
        }
        else if (col.width === '*') {
            autoWidthColGroupIndexs.push(ci);
        }
        else if (col.width.substring(col.width.length - 1) === '%') {
            totalWidth += col._width =
                container.width * col.width.substring(0, col.width.length - 1) / 100;
        }
    });
    if (autoWidthColGroupIndexs.length > 0) {
        computedWidth =
            (container.width - totalWidth) / autoWidthColGroupIndexs.length;
        for (i = 0, l = autoWidthColGroupIndexs.length; i < l; i++) {
            _colGroup.update(autoWidthColGroupIndexs[i], function (O) {
                O._width =
                    computedWidth < options.columnMinWidth
                        ? options.columnMinWidth
                        : computedWidth;
                return O;
            });
        }
    }
    // 컬럼의 시작위치와 끝위치 계산
    for (i = 0; i < _colGroup.length; i++) {
        if (i === 0) {
            _colGroup[i]._sx = 0;
        }
        else {
            _colGroup[i]._sx = _colGroup[i - 1]._ex;
        }
        _colGroup[i]._ex = _colGroup[i]._sx + _colGroup[i]._width;
    }
    return _colGroup;
}
exports.setColGroupWidth = setColGroupWidth;
/**
 *
 * @param containerDOM
 * @param storeState
 * @param state
 * @param {any} colGroup
 * @param {any} options
 * @param {any} styles
 * @return {{styles: any; colGroup: any; leftHeaderColGroup; headerColGroup}}
 */
function calculateDimensions(containerDOM, storeState, state, colGroup, options, styles) {
    if (colGroup === void 0) { colGroup = state.colGroup; }
    if (options === void 0) { options = state.options; }
    if (styles === void 0) { styles = immutable_1.Map(state.styles).toJS(); }
    var list = storeState.list;
    var footSumColumns = state.footSumColumns;
    var headerTable = state.headerTable;
    styles.calculatedHeight = null; // props에의해 정해진 height가 아닌 내부에서 계산된 높이를 사용하고 싶은 경우 숫자로 값 지정
    styles.elWidth = getOuterWidth(containerDOM);
    styles.elHeight = getOuterHeight(containerDOM);
    styles.CTInnerWidth = styles.elWidth;
    styles.CTInnerHeight = styles.elHeight;
    styles.rightPanelWidth = 0;
    colGroup = setColGroupWidth(colGroup, {
        width: styles.elWidth - (styles.asidePanelWidth + options.scroller.size),
    }, options);
    styles.frozenPanelWidth = (function (colGroup, endIndex) {
        var width = 0;
        for (var i = 0, l = endIndex; i < l; i++) {
            width += colGroup[i]._width;
        }
        return width;
    })(colGroup, options.frozenColumnIndex);
    styles.headerHeight = options.header.display
        ? headerTable.rows.length * options.header.columnHeight
        : 0;
    styles.frozenPanelHeight = options.frozenRowIndex * styles.bodyTrHeight;
    styles.footSumHeight = footSumColumns.length * styles.bodyTrHeight;
    styles.pageHeight = options.page.height;
    styles.pageButtonsContainerWidth = options.page.buttonsContainerWidth;
    styles.verticalScrollerWidth =
        styles.elHeight -
            styles.headerHeight -
            styles.pageHeight -
            styles.footSumHeight <
            list.size * styles.bodyTrHeight
            ? options.scroller.size
            : 0;
    styles.horizontalScrollerHeight = (function () {
        var totalColGroupWidth = colGroup.reduce(function (prev, curr) {
            return (prev._width || prev) + curr._width;
        });
        // aside 빼고, 수직 스크롤이 있으면 또 빼고 비교
        var bodyWidth = styles.elWidth - styles.asidePanelWidth - styles.verticalScrollerWidth;
        return totalColGroupWidth > bodyWidth ? options.scroller.size : 0;
    })();
    styles.scrollContentWidth = state.headerColGroup.reduce(function (prev, curr) {
        return (prev._width || prev) + curr._width;
    });
    styles.scrollContentContainerWidth =
        styles.CTInnerWidth -
            styles.asidePanelWidth -
            styles.frozenPanelWidth -
            styles.rightPanelWidth -
            styles.verticalScrollerWidth;
    if (styles.horizontalScrollerHeight > 0) {
        styles.verticalScrollerWidth =
            styles.elHeight -
                styles.headerHeight -
                styles.pageHeight -
                styles.footSumHeight -
                styles.horizontalScrollerHeight <
                list.size * styles.bodyTrHeight
                ? options.scroller.size
                : 0;
    }
    // 수평 너비 결정
    styles.CTInnerWidth = styles.elWidth;
    // 수직 스크롤러의 높이 결정.
    styles.CTInnerHeight = styles.elHeight - styles.pageHeight;
    // get bodyHeight
    styles.bodyHeight = styles.CTInnerHeight - styles.headerHeight;
    // 스크롤컨텐츠의 컨테이너 높이.
    styles.scrollContentContainerHeight =
        styles.bodyHeight - styles.frozenPanelHeight - styles.footSumHeight;
    styles.scrollContentHeight =
        styles.bodyTrHeight *
            (list.size > options.frozenRowIndex
                ? list.size - options.frozenRowIndex
                : 0);
    if (options.scroller.disabledVerticalScroll) {
        styles.calculatedHeight =
            list.size * styles.bodyTrHeight + styles.headerHeight + styles.pageHeight;
        styles.bodyHeight =
            styles.calculatedHeight - styles.headerHeight - styles.pageHeight;
        styles.verticalScrollerWidth = 0;
        styles.CTInnerWidth = styles.elWidth;
        styles.scrollContentContainerWidth =
            styles.CTInnerWidth -
                styles.asidePanelWidth -
                styles.frozenPanelWidth -
                styles.rightPanelWidth;
        styles.scrollContentContainerHeight = styles.scrollContentHeight;
    }
    else {
    }
    styles.verticalScrollerHeight =
        styles.elHeight -
            styles.pageHeight -
            options.scroller.padding * 2 -
            options.scroller.arrowSize;
    styles.horizontalScrollerWidth =
        styles.elWidth -
            styles.verticalScrollerWidth -
            styles.pageButtonsContainerWidth -
            options.scroller.padding * 2 -
            options.scroller.arrowSize;
    styles.scrollerPadding = options.scroller.padding;
    styles.scrollerArrowSize = options.scroller.arrowSize;
    styles.verticalScrollBarHeight = styles.scrollContentHeight
        ? styles.scrollContentContainerHeight *
            styles.verticalScrollerHeight /
            styles.scrollContentHeight
        : 0;
    if (options.scroller.barMinSize > styles.verticalScrollBarHeight) {
        styles.verticalScrollBarHeight = options.scroller.barMinSize;
    }
    styles.horizontalScrollBarWidth = styles.scrollContentWidth
        ? styles.scrollContentContainerWidth *
            styles.horizontalScrollerWidth /
            styles.scrollContentWidth
        : 0;
    if (options.scroller.barMinSize > styles.horizontalScrollBarWidth) {
        styles.horizontalScrollBarWidth = options.scroller.barMinSize;
    }
    return {
        styles: styles,
        colGroup: colGroup,
        leftHeaderColGroup: colGroup.slice(0, options.frozenColumnIndex),
        headerColGroup: colGroup.slice(options.frozenColumnIndex),
    };
}
exports.calculateDimensions = calculateDimensions;
//# sourceMappingURL=_dimension.js.map