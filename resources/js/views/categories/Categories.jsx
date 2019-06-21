import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading';

class Categories extends Component {
  state = {
    loading: true,
    categories: null
  };

  async componentDidMount() {
    try {
      const response = await axios.get('/api/categories');
      const categories = response.data.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      this.setState({ categories, loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { categories, loading } = this.state;

    return (
      <main className="section bg-beige">
        <Container>
          <h1 className="h5 text-uppercase mb-4">Categories</h1>
          {loading ? (
            <Loading />
          ) : (
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
        </Container>
      </main>
    );
  }
}

export default Categories;
