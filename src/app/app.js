import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import {setLocale} from 'hub-dashboard-addons/dist/localization';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import createStore from './redux/index';
import {initWidget} from './redux/actions';
import WidgetContainer from './container/widget-container';
import TRANSLATIONS from './translations';

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) => {
  setLocale(DashboardAddons.locale, TRANSLATIONS);

  const store = createStore(dashboardApi, registerWidgetApi);
  store.dispatch(initWidget());

  return render(
    <Provider store={store}>
      <WidgetContainer dashboardApi={dashboardApi}/>
    </Provider>,
    document.getElementById('app-container')
  );
});
