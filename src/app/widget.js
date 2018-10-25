import React from 'react';
import PropTypes from 'prop-types';

import withTimerHOC from '@jetbrains/hub-widget-ui/dist/timer';
import ConfigurableWidget from '@jetbrains/hub-widget-ui/dist/configurable-widget';
import withWidgetLoaderHOC from '@jetbrains/hub-widget-ui/dist/widget-loader';

import styles from './app.css';

const Widget = (
  {
    isConfiguring,
    dashboardApi,
    widgetTitle,
    Configuration,
    Content
  }
) => (
  <div className={styles.widget} data-test="project-status-widget">
    <ConfigurableWidget
      isConfiguring={isConfiguring}
      dashboardApi={dashboardApi}
      widgetTitle={widgetTitle}
      Configuration={Configuration}
      Content={Content}
    />
  </div>
);

Widget.propTypes = {
  isConfiguring: PropTypes.bool.isRequired,
  dashboardApi: PropTypes.object.isRequired,
  widgetTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  Configuration: PropTypes.func.isRequired,
  Content: PropTypes.func.isRequired
};

export default withTimerHOC(withWidgetLoaderHOC(Widget));
