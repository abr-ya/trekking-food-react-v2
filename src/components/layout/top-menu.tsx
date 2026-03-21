import { Link } from "react-router-dom";

export const TopMenu = () => {
  return (
    <div className="flex gap-2">
      <Link to={"/"} className="hover:underline">
        Home
      </Link>
      <Link to={"/products"} className="hover:underline">
        Products
      </Link>
      <Link to={"/recipes"} className="hover:underline">
        Recipes
      </Link>
      <Link to={"/categories"} className="hover:underline">
        Categories
      </Link>
    </div>
  );
};
