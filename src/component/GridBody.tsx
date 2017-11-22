import * as React from 'react';
import { Range } from 'immutable';
import classNames from 'classnames'

export namespace GridBody {
  export interface Props {
    mounted: boolean;
    gridCSS: any;
    styles: any;
    options: any;
    frozenColumnIndex: number;
    colGroup: any;
    asideColGroup: any;
    leftHeaderColGroup: any;
    headerColGroup: any;
    bodyTable: any;
    asideBodyRowData: any;
    asideBodyGroupingData: any;
    leftBodyRowData: any;
    leftBodyGroupingData: any;
    bodyRowData: any;
    bodyGroupingData: any;
    scrollLeft: number;
    scrollTop: number;
    CTInnerWidth: number;
    CTInnerHeight: number;
    list: any;
    refCallback: Function;
    onMouseDownBody: Function;
  }

  export interface State {
    /* empty */
  }
}


export class GridBody extends React.Component<GridBody.Props, GridBody.State> {
  constructor(props: GridBody.Props) {
    super(props);

  }

  public shouldComponentUpdate(nextProps, nextState) {
    let sameProps = false;

    if (
      this.props.mounted !== nextProps.mounted ||
      JSON.stringify(this.props.options) !== JSON.stringify(nextProps.options) ||
      this.props.CTInnerWidth !== nextProps.CTInnerWidth ||
      this.props.CTInnerHeight !== nextProps.CTInnerHeight ||
      JSON.stringify(this.props.colGroup) !== JSON.stringify(nextProps.colGroup) ||
      this.props.list !== nextProps.list ||
      this.props.scrollLeft !== nextProps.scrollLeft ||
      this.props.scrollTop !== nextProps.scrollTop
    ) {
      sameProps = true;
    }

    return sameProps;
  }

  public render() {
    const {
            mounted,
            gridCSS,
            styles,
            options,
            frozenColumnIndex,
            colGroup,
            asideColGroup,
            leftHeaderColGroup,
            headerColGroup,
            bodyTable,
            asideBodyRowData,
            asideBodyGroupingData,
            leftBodyRowData,
            leftBodyGroupingData,
            bodyRowData,
            bodyGroupingData,
            scrollLeft,
            scrollTop,
            CTInnerWidth,
            CTInnerHeight,
            list,
            refCallback,
            onMouseDownBody
          } = this.props;

    if (!mounted) return null;

    let scrollPaddingLeft = (headerColGroup[ 0 ]) ? headerColGroup[ 0 ]._sx : 0;

    const _paintBody = function (_panelName, _style) {
      return (
        <div data-panel={_panelName} style={_style}>
          <table />
        </div>
      )
    };

    const paintBody = function (_panelName, _colGroup, _bodyRow, _groupRow, _list, _scrollConfig, _style) {

      const getFieldSpan = function (_colGroup, _col, _item, _itemIdx) {
        let lineHeight = (options.body.columnHeight - options.body.columnPadding * 2 - options.body.columnBorderWidth);
        let colAlign = options.body.align || _col.align;
        let label;

        if (_col.key === '__line_number__') {
          label = _itemIdx + 1;
        }
        else if (_col.key === '__row_selector__') {
          label = <div
            className={classNames(gridCSS.checkBox)}
            style={{maxHeight: (_col.width - 10) + 'px', minHeight: (_col.width - 10) + 'px'}} />;
        }
        else {
          label = _item[ _col.key ];
        }

        let spanStyle = {
          height: (options.body.columnHeight - options.body.columnBorderWidth) + 'px',
          lineHeight: lineHeight + 'px',
          textAlign: colAlign
        };

        return (
          <span
            data-span
            data-pos={_col.colIndex + ',' + _col.rowIndex + ',' + _itemIdx}
            style={spanStyle}>
            {label || ' '}
          </span>
        );
      };

      _style.paddingTop = _scrollConfig.sRowIndex * styles.bodyTrHeight;
      if (_scrollConfig.paddingLeft) {
        _style.paddingLeft = _scrollConfig.paddingLeft;
      }

      return (
        <div data-panel={_panelName} style={_style} ref={ref => refCallback(_panelName, ref)}>
          <table style={{height: '100%'}}>
            <colgroup>
              {_colGroup.map(
                (col, ci) => (
                  <col
                    key={ci}
                    style={{width: col._width + 'px'}} />
                )
              )}
              <col />
            </colgroup>
            <tbody>
            {Range(_scrollConfig.sRowIndex, _scrollConfig.eRowIndex).map(
              (li) => {
                const item = _list.get(li);
                if (item) {
                  return (
                    _bodyRow.rows.map(
                      (row, ri) => {
                        return (
                          <tr
                            key={ri}>
                            {row.cols.map((col, ci) => {
                              let cellHeight = options.body.columnHeight * col.rowspan - options.body.columnBorderWidth;
                              let classNameItems = {
                                [gridCSS.lineNumber]: (col.columnAttr === 'lineNumber'),
                                [gridCSS.rowSelector]: (col.columnAttr === 'rowSelector')
                              };

                              return (
                                <td
                                  key={ci}
                                  colSpan={col.colspan}
                                  rowSpan={col.rowspan}
                                  className={classNames(classNameItems)}
                                  style={{height: cellHeight, minHeight: '1px'}}>
                                  {getFieldSpan(colGroup, col, item, li)}
                                </td>
                              );
                            })}
                            <td data-pos={'E,0,' + li}>&nbsp;</td>
                          </tr>
                        )
                      }
                    )
                  )
                }
              }
            )}
            </tbody>
          </table>
        </div>
      )
    };

    let topBodyScrollConfig = {
      sRowIndex: 0,
      eRowIndex: options.frozenRowIndex
    };
    let bodyScrollConfig = {
      sRowIndex: Math.floor(-scrollTop / styles.bodyTrHeight) + options.frozenRowIndex,
      eRowIndex: (Math.floor(-scrollTop / styles.bodyTrHeight) + options.frozenRowIndex) + Math.ceil(styles.bodyHeight / styles.bodyTrHeight) + 1
    };

    interface iPanelStyle {
      left?: number;
      top?: number;
      width?: number;
      height?: number;
    }

    let topAsideBodyPanelStyle : iPanelStyle = {
      left: 0,
      width: styles.asidePanelWidth,
      top: 0,
      height: styles.frozenRowHeight
    };
    let bottomAsideBodyPanelStyle : iPanelStyle = {
      left: 0,
      width: styles.asidePanelWidth,
      top: styles.bodyHeight - styles.footSumHeight,
      height: styles.footSumHeight
    };
    let asideBodyPanelStyle : iPanelStyle = {
      left: 0,
      width: styles.asidePanelWidth,
      top: styles.frozenRowHeight,
      height: styles.bodyHeight - styles.frozenRowHeight - styles.footSumHeight
    };

    let topLeftBodyPanelStyle : iPanelStyle = {
      left: styles.asidePanelWidth,
      width: styles.frozenPanelWidth,
      top: 0,
      height: styles.frozenRowHeight
    };
    let bottomLeftBodyPanelStyle : iPanelStyle = {
      left: styles.asidePanelWidth,
      width: styles.frozenPanelWidth,
      top: styles.bodyHeight - styles.footSumHeight,
      height: styles.footSumHeight
    };
    let leftBodyPanelStyle : iPanelStyle = {
      left: styles.asidePanelWidth,
      width: styles.frozenPanelWidth,
      top: styles.frozenRowHeight,
      height: styles.bodyHeight - styles.frozenRowHeight - styles.footSumHeight
    };

    let topBodyPanelStyle : iPanelStyle = {
      left: styles.frozenPanelWidth + styles.asidePanelWidth,
      width: styles.CTInnerWidth - styles.asidePanelWidth - styles.frozenPanelWidth - styles.rightPanelWidth,
      top: 0,
      height: styles.frozenRowHeight
    };
    let bottomBodyPanelStyle : iPanelStyle = {
      left: styles.frozenPanelWidth + styles.asidePanelWidth,
      width: styles.CTInnerWidth - styles.asidePanelWidth - styles.frozenPanelWidth - styles.rightPanelWidth,
      top: styles.bodyHeight - styles.footSumHeight,
      height: styles.footSumHeight
    };

    let bodyPanelStyle : iPanelStyle = {
      left: styles.frozenPanelWidth + styles.asidePanelWidth,
      width: styles.CTInnerWidth - styles.asidePanelWidth - styles.frozenPanelWidth - styles.rightPanelWidth,
      top: styles.frozenRowHeight,
      height: styles.bodyHeight - styles.frozenRowHeight - styles.footSumHeight
    };

    let topBodyScrollStyle = {
      left: scrollLeft
    };
    let asideBodyScrollStyle = {
      top: scrollTop
    };
    let leftBodyScrollStyle = {
      top: scrollTop
    };
    let bodyScrollStyle = {
      left: scrollLeft,
      top: scrollTop
    };
    let bottomBodyScrollStyle = {
      left: scrollLeft
    };

    return (
      <div
        className={classNames(gridCSS.body)}
        style={{height: styles.bodyHeight}}
        onMouseDown={e => onMouseDownBody(e)}>
        {(styles.asidePanelWidth > 0 && styles.frozenRowHeight > 0) ? _paintBody('top-aside-body', topAsideBodyPanelStyle) : null}
        {(styles.frozenPanelWidth > 0 && styles.frozenRowHeight > 0) ? _paintBody('top-left-body', topLeftBodyPanelStyle) : null}
        {(styles.frozenRowHeight > 0) ? (
          <div data-scroll-container='top-body-scroll-container' style={topBodyPanelStyle}>
            {_paintBody('top-body-scroll', topBodyScrollStyle)}
          </div>
        ) : null}

        {(styles.asidePanelWidth > 0) ? (
          <div data-scroll-container='aside-body-scroll-container' style={asideBodyPanelStyle}>
            {paintBody('aside-body-scroll', asideColGroup, asideBodyRowData, asideBodyGroupingData, list, bodyScrollConfig, asideBodyScrollStyle)}
          </div>
        ) : null}

        {(styles.frozenPanelWidth > 0) ? (
          <div data-scroll-container='left-body-scroll-container' style={leftBodyPanelStyle}>
            {paintBody('left-body-scroll', leftHeaderColGroup, leftBodyRowData, leftBodyGroupingData, list, bodyScrollConfig, leftBodyScrollStyle)}
          </div>
        ) : null}

        <div data-scroll-container='body-scroll-container' style={bodyPanelStyle} ref={ref => refCallback('body-scroll-container', ref)}>
          {paintBody('body-scroll', headerColGroup, bodyRowData, bodyGroupingData, list, Object.assign({}, bodyScrollConfig, {paddingLeft: scrollPaddingLeft}), bodyScrollStyle)}
        </div>

        {(styles.asidePanelWidth > 0 && styles.footSumHeight > 0) ? _paintBody('bottom-aside-body', bottomAsideBodyPanelStyle) : null}
        {(styles.frozenPanelWidth > 0 && styles.footSumHeight > 0) ? _paintBody('bottom-left-body', bottomLeftBodyPanelStyle) : null}
        {(styles.footSumHeight > 0) ? (
          <div data-scroll-container='bottom-body-scroll-container' style={bottomBodyPanelStyle}>
            {_paintBody('bottom-body-scroll', bottomBodyScrollStyle)}
          </div>
        ) : null}
      </div>
    );

  }
}