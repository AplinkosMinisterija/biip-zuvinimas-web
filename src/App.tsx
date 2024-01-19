import { isEqual } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import {
  Location,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import LoaderComponent from './components/other/LoaderComponent';
import { CantLogin } from './pages/CantLogin';
import { Login } from './pages/Login';
import { useAppSelector } from './state/hooks';
import api from './utils/api';
import { ServerErrorCodes } from './utils/constants';
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
  const { ticket, eGates } = Object.fromEntries([...Array.from(searchParams)]);
  const profileId: ProfileId = cookies.get('profileId');
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const routes = useFilteredRoutes();
  const navigateRef = useRef(navigate);

  const isInvalidProfile =
    !profiles?.map((profile) => profile?.id?.toString()).includes(profileId) && loggedIn;

  const updateTokensMutation = useMutation(api.refreshToken, {
    onError: ({ response }: any) => {
      if (isEqual(response.status, ServerErrorCodes.NOT_FOUND)) {
        cookies.remove('refreshToken', { path: '/' });
      }
    },
    onSuccess: (data) => {
      handleUpdateTokens(data);
    },
  });

  const updateTokensMutationMutateAsyncFunction = updateTokensMutation.mutateAsync;

  const shouldUpdateTokens = useCallback(async () => {
    if (!cookies.get('token') && cookies.get('refreshToken')) {
      await updateTokensMutationMutateAsyncFunction();
    }
  }, [updateTokensMutationMutateAsyncFunction]);

  const { mutateAsync: eGateSignsMutation, isLoading: eGatesSignLoading } = useEGatesSign();

  const { mutateAsync: checkAuthMutation } = useCheckAuthMutation();

  const eGatesLoginMutation = useMutation((ticket: string) => api.eGatesLogin({ ticket }), {
    onError: () => {
      navigate(slugs.cantLogin);
    },
    onSuccess: (data) => {
      handleUpdateTokens(data);
      checkAuthMutation();
    },
    retry: false,
  });

  const isLoading =
    initialLoading ||
    [eGatesLoginMutation.isLoading, eGatesSignLoading, updateTokensMutation.isLoading].some(
      (loading) => loading,
    );

  useEffect(() => {
    (async () => {
      await shouldUpdateTokens();
      checkAuthMutation();
      setInitialLoading(false);
    })();
  }, [location.pathname, checkAuthMutation, shouldUpdateTokens]);

  const eGatesLoginMutationMutateAsync = eGatesLoginMutation.mutateAsync;

  useEffect(() => {
    (async () => {
      if (loggedIn) return;

      if (ticket) {
        eGatesLoginMutationMutateAsync(ticket);
      }
      if (eGates !== undefined) {
        eGateSignsMutation();
      }
    })();
  }, [ticket, eGates, eGateSignsMutation, eGatesLoginMutationMutateAsync, loggedIn]);

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
    return <Navigate to={!!profileId ? slugs.fishStockings : slugs.profiles} replace />;
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
