import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { addUser, logout } from '../../actions/user';
import Loading from '../../components/Loading';
import UserInfo from '../../components/UserInfo';
import UserNameContainer from '../../components/UserNameContainer';
import UserAvatarContainer from '../../components/UserAvatarContainer';
import UserPasswordResetForm from '../../components/UserPasswordResetForm';
import UserDeleteAccountForm from '../../components/UserDeleteAccountForm';

class User extends Component {
  state = {
    isLoading: true,
    error: null,
    user: {},
    totalRatings: 0,
    totalReviews: 0,
    name: this.props.user.name || '',
  };

  async componentDidMount() {
    const { userId } = this.props.match.params;

    try {
      const response = await axios.get(`/api/users/${userId}`);

      const { user, totalRatings, totalReviews } = response.data;

      this.setState({ user, totalRatings, totalReviews, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  handleUpdateUser = user => this.setState({ user });

  render() {
    const { user, totalRatings, totalReviews, isLoading, error } = this.state;
    const authUser = this.props.user;

    if (isLoading)
      return (
        <div className="vh-100-nav">
          <Loading />
        </div>
      );

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <main className="section bg-beige min-vh-100-nav">
        <Container>
          <Row>
            <Col xs={12} md={4} className="text-center">
              <UserNameContainer
                user={user}
                onUpdateUser={this.handleUpdateUser}
              />

              <UserAvatarContainer
                user={user}
                onUpdateUser={this.handleUpdateUser}
              />
            </Col>

            <Col
              xs={12}
              md={4}
              className="mt-4 mt-md-0 text-center text-md-left"
            >
              <UserInfo
                user={user}
                totalRatings={totalRatings}
                totalReviews={totalReviews}
              />
            </Col>

            {/* Authenticated Aside */}
            {user.id === authUser.id && (
              <Col
                xs={12}
                md={4}
                className="mt-4 mt-md-0 bg-beige border border-dark p-3"
              >
                <h2 className="h5">Private Links</h2>

                <ul className="list-unstyled">
                  <li>
                    <Link to="/orders" className="default">
                      Orders
                    </Link>
                  </li>
                </ul>

                <h2 className="h5">Account Actions</h2>

                <div>
                  <UserPasswordResetForm user={authUser} />
                  <UserDeleteAccountForm user={authUser} className="mt-2" />
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </main>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = {
  addUser,
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
