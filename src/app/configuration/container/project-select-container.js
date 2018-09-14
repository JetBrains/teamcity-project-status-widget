import {connect} from 'react-redux';

import ProjectSelect from '../component/project-select';
import {selectProject} from '../../redux/actions';

const ProjectSelectContainer = connect(
  ({configuration}) => ({
    isLoading: configuration.isLoadingProjects,
    selectedProject: configuration.selectedProject,
    projectList: configuration.projects,
    loadError: configuration.projectLoadErrorMessage
  }),
  dispatch => ({
    onProjectSelect: item => dispatch(selectProject(item.project))
  })
)(ProjectSelect);

ProjectSelectContainer.propTypes = {};


export default ProjectSelectContainer;
