import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { addUser } from '../actions/user';
import UserNameModal from '../views/users/UserNameModal';

class UserNameContainer extends Component {
  state = {
    name: '',
    isModalOpen: false,
    isProcessing: false,
    validationErrors: {}
  };

  handleOpenModal = () => this.setState({ isModalOpen: true });

  handleCloseModal = () => this.setState({ isModalOpen: false });

  handleChange = e => this.setState({ name: e.target.value });

  handleSubmit = async e => {
    e.preventDefault();

    if (this.state.isProcessing) return;

    this.setState({ isProcessing: true, validationErrors: {} });

    if (!this.validate()) return this.setState({ isProcessing: false });

    const user = this.props.authUser;
    const { name } = this.state;

    try {
      const response = await axios.patch(`/api/users/${user.id}`, {
        name
      });

      const updatedUser = response.data;

      this.props.addUser(updatedUser);
      this.props.onUpdateUser(updatedUser);
      this.setState({ isModalOpen: false, isProcessing: false });
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (error.response.data.errors) {
        this.setState({ validationErrors: error.response.data.errors });
      } else {
        console.log(error);
      }
      this.setState({ isProcessing: false });
    }
  };

  validate() {
    const { name } = this.state;

    if (!name.trim()) {
      this.setState({
        validationErrors: { name: 'The name field is required.' }
      });
      return false;
    }

    return true;
  }

  render() {
    const { user, authUser } = this.props;
    const { name, isModalOpen, validationErrors, isProcessing } = this.state;

    return (
      <>
        <h1 className="h4">
          {user.id !== authUser.id && user.name}

          {user.id === authUser.id && (
            <button
              className="btn-reset position-relative"
              onClick={this.handleOpenModal}
            >
              {user.name}
              <i className="material-icons username-edit-icon">edit</i>
            </button>
          )}
        </h1>

        {user.id === authUser.id && (
          <UserNameModal
            name={name}
            isOpen={isModalOpen}
            onClose={this.handleCloseModal}
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
            validationErrors={validationErrors}
            isProcessing={isProcessing}
          />
        )}
      </>
    );
  }
}

UserNameContainer.propTypes = {
  user: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
  addUser: PropTypes.func.isRequired,
  onUpdateUser: PropTypes.func.isRequired
};

const mapStateToProps = ({ user }) => ({
  authUser: user
});

const mapDispatchToProps = {
  addUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserNameContainer);
