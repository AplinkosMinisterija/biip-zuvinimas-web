import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import {
  Location,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import LoaderComponent from "./components/other/LoaderComponent";
import { CantLogin } from "./pages/CantLogin";
import { Login } from "./pages/Login";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { actions } from "./state/user/reducer";
import api from "./utils/api";
import { ServerErrorCodes } from "./utils/constants";
import {
  handleGetCurrentUser,
  handleResponse,
  handleUpdateTokens
} from "./utils/functions";
import { useFilteredRoutes } from "./utils/hooks";
import { slugs } from "./utils/routes";
import { ProfileId } from "./utils/types";
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
  const profileId: ProfileId = cookies.get("profileId");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const routes = useFilteredRoutes();

  const dispatch = useAppDispatch();

  const shouldUpdateTokens = async () => {
    if (!cookies.get("token") && cookies.get("refreshToken")) {
      await handleResponse({
        endpoint: () => api.refreshToken(),
        onError: (code) => {
          if (isEqual(code, ServerErrorCodes.NOT_FOUND)) {
            cookies.remove("refreshToken", { path: "/" });
          }
        },
        onSuccess: (data) => {
          handleUpdateTokens(data);
        }
      });
    }
  };

  const handleCheckAuth = async () => {
    await shouldUpdateTokens();

    const currentUserData = await handleGetCurrentUser();
    if (currentUserData) {
      dispatch(actions.setUser(currentUserData));
    }
    setLoading(false);
  };

  const handleEGatesSign = async () => {
    await handleResponse({
      endpoint: () => api.eGatesSign(),
      onSuccess: ({ url }) => {
        window.location.replace(url);
      }
    });
  };

  useEffect(() => {
    (async () => {
      if (loggedIn) return;

      if (ticket) {
        setLoading(true);
        await handleResponse({
          endpoint: () => api.eGatesLogin({ ticket }),
          onError: () => {
            navigate(slugs.cantLogin);
          },
          onSuccess: async (data) => {
            handleUpdateTokens(data);
            const currentUserData = await handleGetCurrentUser();
            if (currentUserData) {
              dispatch(actions.setUser(currentUserData));
            }
            setLoading(false);
          }
        });
      }
      if (eGates !== undefined) {
        setLoading(true);
        await handleEGatesSign();
        setLoading(false);
      }
    })();
  }, [ticket, eGates]);

  useEffect(() => {
    (async () => {
      console.log(location.pathname);
      await handleCheckAuth();
    })();
  }, [location.pathname]);

  useEffect(() => {
    const isValidProfile =
      !profiles
        ?.map((profile) => profile?.id?.toString())
        .includes(profileId) && loggedIn;

    if (isValidProfile) {
      cookies.remove("profileId", { path: "/" });

      navigate("");
    }
  }, [profileId, loggedIn]);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <Routes>
        <Route
          element={<PublicRoute profileId={profileId} loggedIn={loggedIn} />}
        >
          <Route path={slugs.login} element={<Login />} />
          <Route path={slugs.cantLogin} element={<CantLogin />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              location={location}
              profileId={profileId}
              loggedIn={loggedIn}
            />
          }
        >
          {(routes || []).map((route, index) => (
            <Route
              key={`route-${index}`}
              path={route.slug}
              element={route.component}
            />
          ))}
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to={
                loggedIn
                  ? profileId
                    ? slugs.fishStockings
                    : slugs.profiles
                  : slugs.login
              }
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
    return (
      <Navigate
        to={!!profileId ? slugs.fishStockings : slugs.profiles}
        replace
      />
    );
  }

  return <Outlet />;
};

const ProtectedRoute = ({ loggedIn, profileId, location }: RouteProps) => {
  if (!loggedIn) {
    return <Navigate to={slugs.login} replace />;
  }

  if (location?.pathname == slugs.profiles && !!profileId) {
    return <Navigate to={slugs.fishStockings} replace />;
  }

  return <Outlet />;
};

export default App;
