import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';

import createStore from './redux/index';
import {initWidget} from './redux/actions';
import WidgetContainer from './container/widget-container';
import {initTranslations} from './translations';

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) => {
  initTranslations(DashboardAddons.locale);

  const store = createStore(dashboardApi, registerWidgetApi);
  store.dispatch(initWidget());

  return render(
    <Provider store={store}>
      <WidgetContainer dashboardApi={dashboardApi}/>
    </Provider>,
    document.getElementById('app-container')
  );
});
