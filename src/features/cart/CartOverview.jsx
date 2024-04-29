import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div className="flex items-center justify-between p-4 px-4 py-4 text-sm uppercase md:text-base bg-stone-800 text-stone-200 sm:px-6">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
