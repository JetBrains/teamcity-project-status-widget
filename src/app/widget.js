import React from 'react';
import PropTypes from 'prop-types';

import Timer from '@jetbrains/hub-widget-ui/dist/timer';
import ConfigurableWidget from '@jetbrains/hub-widget-ui/dist/configurable-widget';
import WidgetLoader from '@jetbrains/hub-widget-ui/dist/widget-loader';

import styles from './app.css';

const Widget = (
  {
    isConfiguring,
    refreshPeriod,
    onRefresh,
    isLoadingBuildStatuses,
    dashboardApi,
    Title,
    Configuration,
    Content
  }
) => (
  <div className={styles.widget} data-test="project-status-widget">
    <Timer
      onTick={onRefresh}
      period={refreshPeriod}
    />
    <WidgetLoader
      isLoading={isLoadingBuildStatuses}
      dashboardApi={dashboardApi}
    />
    <ConfigurableWidget
      isConfiguring={isConfiguring}
      dashboardApi={dashboardApi}
      Title={Title}
      Configuration={Configuration}
      Content={Content}
    />
  </div>
);

Widget.propTypes = {
  isConfiguring: PropTypes.bool.isRequired,
  isLoadingBuildStatuses: PropTypes.bool.isRequired,
  refreshPeriod: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
  dashboardApi: PropTypes.object.isRequired,
  Title: PropTypes.func.isRequired,
  Configuration: PropTypes.func.isRequired,
  Content: PropTypes.func.isRequired
};

export default Widget;
