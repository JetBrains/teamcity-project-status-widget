import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './app.css';

// TODO: remove when it's in hub-widget-ui
EmptyWidgetFaces.HAPPY = '＼(＾▽＾)／';

function WidgetContent({children}) {
  return (
    <div className={styles.widget}>
      {children}
    </div>
  );
}

WidgetContent.propTypes = {
  children: PropTypes.node
};

const Content = (
  {
    teamcityService,
    project,
    buildStatuses,
    buildStatusLoadErrorMessage,
    onConfigure
  }
) => {
  if (!teamcityService || !project) {
    return (
      <WidgetContent>
        <span>
          {i18n('Widget setup is not finished yet.')}
          <span>{' '}</span>
          <Link onClick={onConfigure}>{i18n('Set up...')}</Link>
        </span>
      </WidgetContent>
    );
  } else if (buildStatusLoadErrorMessage) {
    return (
      <WidgetContent>
        <EmptyWidget face={EmptyWidgetFaces.ERROR}>
          {i18n('Cannot load build statuses')}
          <br/>
          {buildStatusLoadErrorMessage}
        </EmptyWidget>
      </WidgetContent>
    );
  } else if (!buildStatuses.length) {
    return (
      <WidgetContent>
        <EmptyWidget face={EmptyWidgetFaces.HAPPY}>{i18n('No failed builds')}</EmptyWidget>
      </WidgetContent>
    );
  } else {
    return (
      <WidgetContent>
        {JSON.stringify(buildStatuses)}
      </WidgetContent>
    );
  }
};

Content.propTypes = {
  teamcityService: PropTypes.object,
  project: PropTypes.object,
  buildStatuses: PropTypes.array.isRequired,
  buildStatusLoadErrorMessage: PropTypes.string,
  onConfigure: PropTypes.func.isRequired
};

export default Content;
