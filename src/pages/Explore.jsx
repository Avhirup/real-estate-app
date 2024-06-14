import { Link } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';
import { CategoryCard } from '../components/categories/CategoryCard';
export default function Explore() {
  return (
    <div className="explore container ">
      <header className="exploreHeader">
        {/* <Typography variant="h5" color="blue-gray">
        Welcome to PropertyEase, where you can get your dream property at your
        ease.
        </Typography> */}
        <h2 className="front-heading">
          Welcome to <span className="special-heading">PropertyEase</span>,
          where you get your dream property at your ease.
        </h2>
      </header>
      <main className="exploreMain">
        {/* slider here */}
        <div className="categoryHeading">
          <p className="mb-4 text-xl font-bold">Categories</p>
        </div>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <CategoryCard
              heading="Properties for rent"
              imgLink="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
          <Link to="/category/sale">
            <CategoryCard
              heading="Properties for sale"
              imgLink="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </div>
      </main>
    </div>
  );
}
