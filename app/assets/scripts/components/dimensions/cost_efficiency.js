'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('lodash');

var BoxChart = require('../charts/box_chart');
var BarChart = require('../charts/bar_chart');

var IndCostEfficiency = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
  },

  distributionChartPopover : function(d, i, otherData) {
    var buckets = otherData.buckets;
    return (
      <div>
        Number of contracts: {d[0]}<br/>
        Price bucket: {buckets[i]} - {buckets[i + 1]}
      </div>
    );
  },

  variationChartPopover : function(d) {
    return (
      <div>
        min: {d.whisker1}<br/>
        q1: {d.q1}<br/>
        median: {d.median}<br/>
        q3: {d.q3}<br/>
        max: {d.whisker2}
      </div>
    );
  },

  render: function() {

    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var distributionChartData = _.find(chartData, {id: 'price-distribution'});
    var variationChartData = _.find(chartData, {id: 'price-variation'});

    var distributionCharts, variationCharts;

    if (distributionChartData) {
      distributionCharts = distributionChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <BarChart data={o.data} x={distributionChartData.x}  y={distributionChartData.y} popoverContentFn={this.distributionChartPopover}/>
          </div>
        );
      }.bind(this));
    }

    if (variationChartData) {
      variationCharts = (
        <div className="chart-item">
          <BoxChart data={variationChartData.data} x={_.omit(variationChartData.x, 'label')} popoverContentFn={this.variationChartPopover}/>
        </div>
      );
    }

    var distributionTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">Price distribution</h1>
        {distributionCharts && distributionCharts.length ? <div className="tile-body">{distributionCharts}</div> : null}
      </section>
    );

    var variationTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">Price variation</h1>
        {variationCharts ? <div className="tile-body">{variationCharts}</div> : null}
      </section>
    );

    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>Paying the most economical price is a fundamental goal of any purchasing decision, whether on our private lives, corporate work or on government operations.</p>
          </div>
        </section>
        {distributionTile}
        {variationTile}
      </div>
    );
  }
});
