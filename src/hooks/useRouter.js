import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  return {
    push: (url) => navigate(url),
    replace: (url) => navigate(url, { replace: true }),
    pathname: location.pathname,
    query: { ...params, ...Object.fromEntries(searchParams.entries()) },
    back: () => navigate(-1),
    refresh: () => navigate(0),
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}
