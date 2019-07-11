import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import UserAvatarModal from './UserAvatarModal';
import { addUser } from '../actions/user';
import { addNotification } from '../actions/notifications';

class UserAvatarContainer extends Component {
  state = {
    isModalOpen: false,
    isProcessing: false,
    file: null,
    validationErrors: {}
  };

  source = axios.CancelToken.source();

  componentWillUnmount() {
    this.source.cancel();
  }

  handleOpenModal = () => this.setState({ isModalOpen: true });

  handleCloseModal = () => this.setState({ isModalOpen: false });

  handleChange = e => this.setState({ file: e.target.files[0] });

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true, validationErrors: {} });

    if (!this.validate()) return this.setState({ isProcessing: false });

    const user = this.props.authUser;
    const { file } = this.state;

    const data = new FormData();
    data.append('avatar', file, file.name);

    try {
      const response = await axios.post(
        `/api/users/${user.id}/avatar`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        },
        {
          cancelToken: this.source.token
        }
      );

      const updatedUser = { ...user, avatar: response.data };

      this.setState({ isProcessing: false, isModalOpen: false, file: null });
      this.props.addUser(updatedUser);
      this.props.onUpdateUser(updatedUser);
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (error.response.data.errors) {
        this.setState({ validationErrors: error.response.data.errors });
      } else {
        this.props.addNotification(`Something went wrong: ${error.message}.`);
      }
      this.setState({ isProcessing: false });
    }
  };

  handleDelete = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true });

    const user = this.props.authUser;

    try {
      await axios.delete(`/api/users/${user.id}/avatar`, {
        cancelToken: this.source.token
      });

      const updatedUser = { ...user, avatar: '/storage/avatars/default.svg' };

      this.setState({ isProcessing: false, isModalOpen: false });
      this.props.addUser(updatedUser);
      this.props.onUpdateUser(updatedUser);
    } catch (error) {
      if (axios.isCancel(error)) return;
      this.props.addNotification(`Something went wrong: ${error.message}.`);
      this.setState({ isProcessing: false });
    }
  };

  validate() {
    const { file } = this.state;

    if (!file) {
      this.setState({ validationErrors: { avatar: 'No file selected.' } });
      return false;
    }

    return true;
  }

  render() {
    const { user, authUser } = this.props;
    const { isProcessing, isModalOpen, file, validationErrors } = this.state;

    return (
      <>
        <div className="mt-3">
          <div className="avatar-wrapper">
            <img src={user.avatar} />

            {user.id === authUser.id && (
              <Button
                variant="link"
                className="avatar-wrapper__overlay"
                onClick={this.handleOpenModal}
              >
                <span className="mr-2">Change</span>
                <i className="material-icons align-top">camera_alt</i>
              </Button>
            )}
          </div>
        </div>

        {user.id === authUser.id && (
          <UserAvatarModal
            avatar={user.avatar}
            isOpen={isModalOpen}
            onClose={this.handleCloseModal}
            onSubmit={this.handleSubmit}
            file={file}
            onChange={this.handleChange}
            isProcessing={isProcessing}
            onDelete={this.handleDelete}
            validationErrors={validationErrors}
          />
        )}
      </>
    );
  }
}

UserAvatarContainer.propTypes = {
  user: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
  addUser: PropTypes.func.isRequired,
  onUpdateUser: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapStateToProps = ({ user }) => ({
  authUser: user
});

const mapDispatchToProps = {
  addUser,
  addNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAvatarContainer);
