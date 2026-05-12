import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-sky-50/80 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-indigo-600/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link
          to="/"
          className="text-xl font-semibold text-slate-900 dark:text-slate-100"
        >
          Smart LMS
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {user.role.toUpperCase()}
              </span>
              <button
                onClick={logout}
                className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-indigo-800"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
