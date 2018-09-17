import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './app.css';
import Investigation from './investigation';

import buildStatusStyles from './investigation.css';

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

const Content = ({teamcityService, buildStatuses, buildStatusLoadErrorMessage, onConfigure}) => {
  if (!teamcityService) {
    return (
      <WidgetContent>
        <span>
          {i18n('TeamCity service is not configured yet.')}
          <Link onClick={onConfigure}>{i18n('Set up...')}</Link>
        </span>
      </WidgetContent>
    );
  } else if (buildStatusLoadErrorMessage) {
    return (
      <WidgetContent>
        <EmptyWidget face={EmptyWidgetFaces.ERROR}>
          {i18n('Cannot load buildStatuses')}
          <br/>
          {buildStatusLoadErrorMessage}
        </EmptyWidget>
      </WidgetContent>
    );
  } else if (!buildStatuses.length) {
    return (
      <WidgetContent>
        <EmptyWidget face={EmptyWidgetFaces.JOY}>
          <div dangerouslySetInnerHTML={{__html: i18n('No buildStatuses<br>are assigned to you')}}/>
        </EmptyWidget>
      </WidgetContent>
    );
  } else {
    return (
      <WidgetContent>
        <ul className={buildStatusStyles.investigations}>
          {buildStatuses.map(buildStatus => (
            <Investigation
              key={buildStatus.id}
              name={buildStatus.name}
              url={buildStatus.url}
              tests={buildStatus.tests}
              problems={buildStatus.problems}
            />
          ))}
        </ul>
      </WidgetContent>
    );
  }
};

Content.propTypes = {
  teamcityService: PropTypes.object,
  buildStatuses: PropTypes.array.isRequired,
  buildStatusLoadErrorMessage: PropTypes.string,
  onConfigure: PropTypes.func.isRequired
};

export default Content;
