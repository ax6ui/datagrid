"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getStylesAboutFilteredList(_list, options, styles) {
    const { elHeight = 0, headerHeight = 0, footSumHeight = 0, bodyTrHeight = 0, horizontalScrollerHeight = 0, pageHeight = 0, scrollContentContainerHeight = 0, verticalScrollerHeight = 0, } = styles;
    const { scroller: optionsScroller = {}, page: optionsPage = {}, frozenRowIndex = 0, } = options;
    const { height: optionsPageHeight = 0 } = optionsPage;
    const { size: optionsScrollerSize = 0, barMinSize: optionsScrollerBarMinSize = 0, } = optionsScroller;
    const dataLength = _list ? _list.length : 0;
    let currentStyles = {};
    currentStyles.frozenPanelHeight = frozenRowIndex * bodyTrHeight;
    currentStyles.scrollContentHeight =
        bodyTrHeight *
            (dataLength > frozenRowIndex ? dataLength - frozenRowIndex : 0);
    currentStyles.verticalScrollerWidth = 0;
    if (elHeight - headerHeight - optionsPageHeight - footSumHeight <
        dataLength * bodyTrHeight) {
        currentStyles.verticalScrollerWidth = optionsScrollerSize;
    }
    currentStyles.verticalScrollBarHeight = currentStyles.scrollContentHeight
        ? scrollContentContainerHeight *
            verticalScrollerHeight /
            currentStyles.scrollContentHeight
        : 0;
    if (optionsScrollerBarMinSize > currentStyles.verticalScrollBarHeight) {
        currentStyles.verticalScrollBarHeight = optionsScrollerBarMinSize;
    }
    if (horizontalScrollerHeight > 0 &&
        elHeight -
            headerHeight -
            pageHeight -
            footSumHeight -
            horizontalScrollerHeight <
            dataLength * bodyTrHeight) {
        currentStyles.verticalScrollerWidth = optionsScrollerSize;
    }
    currentStyles.scrollContentHeight =
        bodyTrHeight *
            (dataLength > frozenRowIndex ? dataLength - frozenRowIndex : 0);
    return currentStyles;
}
exports.default = getStylesAboutFilteredList;
//# sourceMappingURL=getStylesAboutFilteredList.js.map