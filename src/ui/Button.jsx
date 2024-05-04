import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const base =
    "inline-block text-sm font-semibold tracking-wide uppercase transition-colors duration-300 bg-yellow-400 rounded-full  disabled:cursor-not-allowed focus:ring-offset-2 focus:outline-none focus:bg-yellow-300 focus:ring-yellow-300 focus:ring hover:bg-yellow-300 text-stone-800";

  const styles = {
    primary: base + " px-4 py-3 md:px-6 md:py-4",
    small: base + " px-4 py-2 sm:px-5 sm:py-2.5 text-xs",
    secondary:
      "inline-block text-sm  font-semibold tracking-wide uppercase border-2 norder-stone-300 transition-colors duration-300  rounded-full  disabled:cursor-not-allowed focus:ring-offset-2 focus:outline-none focus:bg-stone-300 focus:ring-stone-300 focus:ring hover:bg-stone-300 text-stone-800 px-4 py-2.5 md:px-6 md:py-3.5",
  };
  if (to)
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );
  if (onClick)
    return (
      <button disabled={disabled} className={styles[type]} onClick={onClick}>
        {children}
      </button>
    );
  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}
export default Button;
