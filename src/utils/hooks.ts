import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useAppSelector } from "../state/hooks";
import api, { GetAllResponse } from "./api";
import { RolesTypes } from "./constants";
import { getOnLineStatus, handleResponse } from "./functions";
import { routes } from "./routes";
import { FishType, Municipality, User } from "./types";

const cookies = new Cookies();

export const useFilteredRoutes = () => {
  const profile = useGetCurrentProfile();

  return routes.filter((route) => {
    if (!route?.slug) return false;
    if (route.tenantOwner) {
      return [RolesTypes.USER_ADMIN, RolesTypes.OWNER].includes(profile?.role!);
    }

    return true;
  });
};

export const useFishTypes = () => {
  const [fishAges, setFishAges] = useState<FishType[]>([]);

  useEffect(() => {
    handleResponse({
      endpoint: () => api.getFishTypes(),
      onSuccess: (list: GetAllResponse<FishType>) => {
        setFishAges(list.rows);
      },
    });
  }, []);

  return fishAges;
};

export const useMunicipalities = () => {
  const [fishAges, setFishAges] = useState<Municipality[]>([]);

  useEffect(() => {
    handleResponse({
      endpoint: () => api.getMunicipalities(),
      onSuccess: (list: GetAllResponse<Municipality>) => {
        setFishAges(list.rows);
      },
    });
  }, []);

  return fishAges;
};

export const useSignatureUsers = (id: string) => {
  const [users, setUsers] = useState<
    { id: string; name: string; users: string[] }[]
  >([]);

  useEffect(() => {
    handleResponse({
      endpoint: () => api.geSignatureUsers(id),
      onSuccess: (list: { id: string; name: string; users: string[] }[]) => {
        setUsers(list);
      },
    });
  }, []);

  return users;
};

export const useAssignedToUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleSetUsers = () => {
    if (cookies.get("profileId") === "freelancer") return;

    handleResponse({
      endpoint: () => api.geUsersByTenant(),
      onSuccess: (list: User[]) => {
        setUsers(list);
      },
    });
  };

  useEffect(() => {
    handleSetUsers();
  }, []);

  return users;
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        const { latitude, longitude } = location.coords;
        setLocation({ x: latitude, y: longitude });
      });
    }
  }, []);
  return location;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    handleResponse({
      endpoint: () => api.getSettings(),
      onSuccess: (settings: {
        minTimeTillFishStocking: number;
        maxTimeForRegistration: number;
      }) => {
        setSettings(settings);
        setLoading(false);
      },
    });
  }, []);

  return { loading, minTime: settings.minTimeTillFishStocking || 0 };
};

export const useRecentLocations = () => {
  const [location, setLocation] = useState<any>([]);

  useEffect(() => {
    handleResponse({
      endpoint: () => api.getRecentLocations(),
      onSuccess: (data) => {
        setLocation(data);
      },
    });
  }, []);

  return location;
};

export const useFishAges = () => {
  const [fishAges, setFishAges] = useState<any>([]);

  useEffect(() => {
    handleResponse({
      endpoint: () => api.getFishAges(),
      onSuccess: (list: GetAllResponse<any>) => {
        setFishAges(list.rows);
      },
    });
  }, []);

  return fishAges;
};

export const useGetCurrentProfile = () => {
  const profiles = useAppSelector((state) => state.user.userData.profiles);
  const profileId = cookies.get("profileId");
  const currentProfile = profiles?.find((profile) => profile.id == profileId);
  return currentProfile;
};

export const useIsFreelancer = () => {
  const profile = useGetCurrentProfile();
  return profile?.freelancer;
};

export const useNavigatorOnLine = () => {
  const [status, setStatus] = useState(getOnLineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return status;
};
