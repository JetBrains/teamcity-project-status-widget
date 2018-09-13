import React from 'react';
import PropTypes from 'prop-types';

import Link from '@jetbrains/ring-ui/components/link/link';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './app.css';
import Investigation from './investigation';

import investigationStyles from './investigation.css';

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

const Content = ({teamcityService, investigations, investigationLoadErrorMessage, onConfigure}) => {
  if (!teamcityService) {
    return (
      <WidgetContent>
        <span>
          {i18n('TeamCity service is not configured yet.')}
          <Link onClick={onConfigure}>{i18n('Set up...')}</Link>
        </span>
      </WidgetContent>
    );
  } else if (investigationLoadErrorMessage) {
    return (
      <WidgetContent>
        <EmptyWidget face={EmptyWidgetFaces.ERROR}>
          {i18n('Cannot load investigations')}
          <br/>
          {investigationLoadErrorMessage}
        </EmptyWidget>
      </WidgetContent>
    );
  } else if (!investigations.length) {
    return (
      <WidgetContent>
        <EmptyWidget face={EmptyWidgetFaces.JOY}>
          <div dangerouslySetInnerHTML={{__html: i18n('No investigations<br>are assigned to you')}}/>
        </EmptyWidget>
      </WidgetContent>
    );
  } else {
    return (
      <WidgetContent>
        <ul className={investigationStyles.investigations}>
          {investigations.map(investigation => (
            <Investigation
              key={investigation.id}
              name={investigation.name}
              url={investigation.url}
              tests={investigation.tests}
              problems={investigation.problems}
            />
          ))}
        </ul>
      </WidgetContent>
    );
  }
};

Content.propTypes = {
  teamcityService: PropTypes.object,
  investigations: PropTypes.array.isRequired,
  investigationLoadErrorMessage: PropTypes.string,
  onConfigure: PropTypes.func.isRequired
};

export default Content;
