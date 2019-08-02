import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading';

class Categories extends Component {
  state = {
    isLoading: true,
    error: null,
    categories: [],
  };

  async componentDidMount() {
    try {
      const response = await axios.get('/api/categories');
      const categories = response.data.categories.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      this.setState({ categories, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  render() {
    const { categories, isLoading, error } = this.state;

    if (isLoading) return <Loading />;

    if (error) return <p>Something went wrong: {error.message}.</p>;

    return (
      <main className="section bg-beige">
        <Container>
          <h1 className="h5 text-uppercase mb-4">Categories</h1>
          <ul className="list-unstyled categories-list">
            {categories.map(category => (
              <li key={category.id} className="categories-list__category">
                <Link to={`/categories/${category.id}`}>
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
    );
  }
}

export default Categories;
