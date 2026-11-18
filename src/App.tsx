import { useMutation } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Location,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import LoaderComponent from './components/other/LoaderComponent';
import { CantLogin } from './pages/CantLogin';
import { Login } from './pages/Login';
import { useAppSelector } from './state/hooks';
import api from './utils/api';
import { ServerErrorCodes } from './utils/constants';
import { claimEGatesTicket, getSearchWithoutEGatesTicket } from './utils/egatesTicket';
import { handleUpdateTokens } from './utils/functions';
import { useCheckAuthMutation, useEGatesSign, useFilteredRoutes } from './utils/hooks';
import { slugs } from './utils/routes';
import { ProfileId } from './utils/types';
const cookies = new Cookies();
interface RouteProps {
  loggedIn: boolean;
  profileId?: ProfileId;
  location?: Location;
}

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const profiles = useAppSelector((state) => state.user.userData.profiles);
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get('ticket');
  const eGates = searchParams.get('eGates');
  const profileId: ProfileId = cookies.get('profileId');
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();
  const locationRef = useRef(location);
  const navigate = useNavigate();
  const routes = useFilteredRoutes();
  const navigateRef = useRef(navigate);

  const isInvalidProfile =
    !profiles?.map((profile) => profile?.id?.toString()).includes(profileId) && loggedIn;

  const { mutateAsync: updateTokenMutation, isPending: updateTokenLoading } = useMutation({
    mutationFn: api.refreshToken,
    onError: ({ response }: any) => {
      if (isEqual(response.status, ServerErrorCodes.NOT_FOUND)) {
        cookies.remove('refreshToken', { path: '/' });
      }
    },
    onSuccess: (data) => {
      handleUpdateTokens(data);
    },
  });

  const shouldUpdateTokens = useCallback(async () => {
    if (!cookies.get('token') && cookies.get('refreshToken')) {
      await updateTokenMutation();
    }
  }, [updateTokenMutation]);

  const { mutateAsync: eGateSignsMutation, isLoading: eGatesSignLoading } = useEGatesSign();

  const { mutateAsync: checkAuthMutation } = useCheckAuthMutation();

  useLayoutEffect(() => {
    locationRef.current = location;
  }, [location]);

  const finishEGatesLogin = (submittedTicket: string, redirectTo?: string) => {
    const { pathname, search, hash } = locationRef.current;
    const remainingSearch = getSearchWithoutEGatesTicket(search, submittedTicket);
    if (remainingSearch === undefined) return;

    navigate(
      { pathname: redirectTo ?? pathname, search: remainingSearch, hash },
      { replace: true },
    );
  };

  const { mutate: sendEGatesTicket, isPending: eGatesLoginLoading } = useMutation({
    mutationFn: (ticket: string) => api.eGatesLogin({ ticket }),
    onError: (_error, submittedTicket) => {
      finishEGatesLogin(submittedTicket, cookies.get('token') ? undefined : slugs.cantLogin);
    },
    onSuccess: async (data, submittedTicket) => {
      handleUpdateTokens(data);
      // Selecting the only profile can reload the page during the auth check.
      finishEGatesLogin(submittedTicket);
      await checkAuthMutation();
    },
    retry: false,
  });

  const isLoading =
    initialLoading ||
    [eGatesLoginLoading, eGatesSignLoading, updateTokenLoading].some((loading) => loading);

  useEffect(() => {
    (async () => {
      await shouldUpdateTokens();
      checkAuthMutation();
      setInitialLoading(false);
    })();
  }, [location.pathname, checkAuthMutation, shouldUpdateTokens]);

  useEffect(() => {
    if (!loggedIn && ticket && claimEGatesTicket(ticket)) {
      sendEGatesTicket(ticket);
    }
  }, [ticket, sendEGatesTicket, loggedIn]);

  useEffect(() => {
    if (!loggedIn && eGates !== null) {
      eGateSignsMutation();
    }
  }, [eGates, eGateSignsMutation, loggedIn]);

  useEffect(() => {
    if (!isInvalidProfile) return;

    cookies.remove('profileId', { path: '/' });

    if (!navigateRef?.current) return;

    navigateRef?.current('');
  }, [profileId, loggedIn, isInvalidProfile]);

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <Routes>
        <Route element={<PublicRoute profileId={profileId} loggedIn={loggedIn} />}>
          <Route path={slugs.login} element={<Login />} />
          <Route path={slugs.cantLogin} element={<CantLogin />} />
        </Route>

        <Route
          element={<ProtectedRoute location={location} profileId={profileId} loggedIn={loggedIn} />}
        >
          {(routes || []).map((route, index) => (
            <Route key={`route-${index}`} path={route.slug} element={route.component} />
          ))}
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to={loggedIn ? (profileId ? slugs.fishStockings : slugs.profiles) : slugs.login}
            />
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

const PublicRoute = ({ loggedIn, profileId }: RouteProps) => {
  if (loggedIn) {
    return <Navigate to={profileId ? slugs.fishStockings : slugs.profiles} replace />;
  }

  return <Outlet />;
};

const ProtectedRoute = ({ loggedIn, profileId, location }: RouteProps) => {
  if (!loggedIn) {
    return <Navigate to={slugs.login} replace />;
  }

  if (location?.pathname === slugs.profiles && !!profileId) {
    return <Navigate to={slugs.fishStockings} replace />;
  }

  return <Outlet />;
};

export default App;
