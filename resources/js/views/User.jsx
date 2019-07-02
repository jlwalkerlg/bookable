import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FileInput from '../components/FileInput';
import { addUser, logout } from '../actions/user';
import Loading from '../components/Loading';

class Account extends Component {
  state = {
    loading: true,
    error: null,
    user: {},
    totalRatings: 0,
    totalReviews: 0,
    name: this.props.user.name || '',
    file: null
  };

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    const { userId } = this.props.match.params;
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const { user, totalRatings, totalReviews } = response.data;
      this.setState({ user, totalRatings, totalReviews, loading: false });
    } catch (error) {
      console.log(error);
    }
  };

  handleChangeAvatar = e => this.setState({ file: e.target.files[0] });

  handleSubmitAvatar = async e => {
    e.preventDefault();

    const { user } = this.state;
    const { file } = this.state;

    const data = new FormData();
    data.append('avatar', file, file.name);

    try {
      const response = await axios.post(`/api/users/${user.id}/avatar`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      this.props.addUser({ ...user, avatar: response.data });
      this.setState({ user: { ...user, avatar: response.data }, file: null });
    } catch (error) {
      this.setState({ error });
    }
  };

  handleDeleteAvatar = async e => {
    e.preventDefault();

    const { user } = this.props;

    try {
      await axios.delete(`/api/users/${user.id}/avatar`);
      this.props.addUser({ ...user, avatar: '/storage/avatars/default.svg' });
      this.setState({
        user: { ...this.state.user, avatar: '/storage/avatars/default.svg' }
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteAccount = async e => {
    e.preventDefault();
    if (!confirm('Are you sure you wish to delete your account?')) return;

    const { user } = this.props;
    try {
      await axios.delete(`/api/users/${user.id}`);
      this.props.logout();
    } catch (error) {
      console.log(error);
    }
  };

  handleChangeName = e => {
    this.setState({ name: e.target.value });
  };

  handleSubmitName = async e => {
    e.preventDefault();
    const { user } = this.props;
    const { name } = this.state;
    try {
      const response = await axios.patch(`/api/users/${user.id}`, {
        name
      });
      const updatedUser = response.data;
      this.setState({ user: { ...this.state.user, name: updatedUser.name } });
      this.props.addUser({ ...user, name: updatedUser.name });
    } catch (error) {
      console.log(error);
    }
  };

  handlePasswordReset = async e => {
    e.preventDefault();
    const { user } = this.props;
    try {
      const response = await axios.post(`/api/passwords/reset`, {
        email: user.email
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      user,
      file,
      totalRatings,
      totalReviews,
      loading,
      error,
      name
    } = this.state;
    const authUser = this.props.user;

    if (loading) return <Loading />;

    if (error) return <div>Error!</div>;

    return (
      <main className="section">
        <Container>
          <Row>
            <Col xs={12} md={8}>
              <h1 className="h4">{user.name}</h1>

              <div className="mt-1">
                <img
                  src={user.avatar}
                  style={{ maxWidth: '200px', borderRadius: '50%' }}
                />
              </div>

              <div className="mt-3">
                <p className="m-0">Books rated: {totalRatings}</p>
                <p className="m-0">Books reviewed: {totalReviews}</p>
              </div>

              {/* Links */}
              <ul className="list-unstyled mt-4">
                <li>
                  <Link to={`/users/${user.id}/ratings`}>Ratings</Link>
                </li>
                <li>
                  <Link to={`/users/${user.id}/shelves`}>Reviews</Link>
                </li>
                <li>
                  <Link to={`/users/${user.id}/shelves`}>Shelves</Link>
                </li>
              </ul>
            </Col>

            {/* Authenticated Aside */}
            <Col xs={12} md={4}>
              {user.id === authUser.id && (
                <div className="card p-2">
                  {/* Reset password */}
                  <Button variant="primary" onClick={this.handlePasswordReset}>
                    Reset password
                  </Button>

                  {/* Update name */}
                  <Form
                    action=""
                    method="POST"
                    onSubmit={this.handleSubmitName}
                    className="mt-3"
                  >
                    <Form.Control
                      id="name"
                      name="name"
                      placeholder="Change user name..."
                      value={name}
                      onChange={this.handleChangeName}
                    />
                    <Button variant="dark" type="submit">
                      Change Name
                    </Button>
                  </Form>

                  {/* Delete account */}
                  <div className="mt-3">
                    <Button
                      variant="outline-danger"
                      onClick={this.handleDeleteAccount}
                    >
                      Delete account
                    </Button>
                  </div>

                  {/* Avatar */}
                  <Form
                    action="/"
                    method="POST"
                    encType="multipart/form-data"
                    className="mt-4"
                    onSubmit={this.handleSubmitAvatar}
                  >
                    <Form.Group controlId="avatar">
                      <Form.Label className="file-label">Avatar</Form.Label>
                      <FileInput
                        name="avatar"
                        file={file}
                        onChange={this.handleChangeAvatar}
                      />
                    </Form.Group>

                    <Button type="submit">Submit</Button>
                  </Form>

                  {user.avatar !== '/storage/avatars/default.svg' && (
                    <Button onClick={this.handleDeleteAvatar}>
                      Delete Avatar
                    </Button>
                  )}

                  {/* Private links */}
                  <ul className="list-unstyled mt-4">
                    <li>
                      <Link to="/orders">Orders</Link>
                    </li>
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </main>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

const mapDispatchToProps = {
  addUser,
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
