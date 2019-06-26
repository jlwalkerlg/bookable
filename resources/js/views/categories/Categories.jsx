import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Async from '../../components/Async';

class Categories extends Component {
  state = {
    loading: true,
    error: null,
    categories: null
  };

  async componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    this.setState({ loading: true });
    try {
      const response = await axios.get('/api/categories');
      const categories = response.data.categories.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      this.setState({ categories, loading: false, error: null });
    } catch (error) {
      this.setState({ loading: false, error: error.response.statusText });
    }
  };

  render() {
    const { categories, loading, error } = this.state;

    return (
      <main className="section bg-beige">
        <Container>
          <h1 className="h5 text-uppercase mb-4">Categories</h1>
          <Async loading={loading} error={error} retry={this.fetchCategories}>
            {() => (
              <ul className="list-unstyled categories-list">
                {categories.map((category, index) => (
                  <li key={index} className="categories-list__category">
                    <Link to={`/category/${category.id}`}>
                      <p>{category.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Container>
      </main>
    );
  }
}

export default Categories;
