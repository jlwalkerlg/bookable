import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import FileInput from '../components/FileInput';
import { addUser } from '../actions/user';

class Account extends Component {
  state = {
    avatar: null
  };

  handleChange = e => this.setState({ avatar: e.target.files[0] });

  handleSubmit = async e => {
    e.preventDefault();

    const { user } = this.props;
    const { avatar } = this.state;

    const data = new FormData();
    data.append('avatar', avatar, avatar.name);

    try {
      const response = await axios.post(`/api/users/${user.id}/avatar`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      this.props.addUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = async e => {
    e.preventDefault();

    const { user } = this.props;

    try {
      await axios.delete(`/api/users/${user.id}/avatar`);
      this.props.addUser({ ...user, avatar: '/storage/avatars/default.svg' });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { user } = this.props;

    return (
      <main className="section">
        <Container>
          <h1 className="h4">Account</h1>

          <Button onClick={this.handleDelete}>Delete Avatar</Button>

          <img src={user.avatar} />

          <Form
            action="/"
            method="POST"
            encType="multipart/form-data"
            className="mt-4"
            onSubmit={this.handleSubmit}
          >
            <Form.Group controlId="avatar">
              <Form.Label className="file-label">Avatar</Form.Label>
              <FileInput name="avatar" onChange={this.handleChange} />
            </Form.Group>

            <Button type="submit">Submit</Button>
          </Form>
        </Container>
      </main>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

const mapDispatchToProps = {
  addUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
