import {connect} from 'react-redux';

import Input, {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import {updateTitle} from '../../redux/actions';


const TitleInputContainer = connect(
  state => ({
    label: i18n('Optional title'),
    'data-test': 'widget-name-input',
    value: state.configuration.title || '',
    size: InputSize.AUTO
  }),
  dispatch => ({
    onChange: event => dispatch(updateTitle(event.target.value))
  })
)(Input);

TitleInputContainer.propTypes = {};

export default TitleInputContainer;
