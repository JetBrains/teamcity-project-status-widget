import {connect} from 'react-redux';

import ProjectSelect from '../component/project-select';
import {loadProjects, selectProject} from '../../redux/actions';

const ProjectSelectContainer = connect(
  ({configuration}) => ({
    isLoading: configuration.isLoadingProjects,
    isDisabled: configuration.selectedTeamcityService == null,
    selectedProject: configuration.selectedProject,
    projectList: configuration.projects,
    loadError: configuration.projectLoadErrorMessage
  }),
  dispatch => ({
    onProjectSelect: item => dispatch(selectProject(item.project)),
    onOpen: () => dispatch(loadProjects())
  })
)(ProjectSelect);

ProjectSelectContainer.propTypes = {};


export default ProjectSelectContainer;
