import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { handleResponse } from "../utils/functions";
import type { AppDispatch, RootState } from "./store";

interface GetOneProps {
  endpoint: () => Promise<any>;
  onError?: (props: any) => void;
  canFetch: boolean;
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetOneData = ({ endpoint, onError, canFetch }: GetOneProps) => {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>();
  useEffect(() => {
    (async () => {
      if (!canFetch) return setLoading(false);

      await handleResponse({
        endpoint: () => endpoint(),
        onSuccess: (data) => {
          setItem(data);
        },
        onError
      });
      setLoading(false);
    })();
  }, []);

  return { loading, item };
};

export const useGenericTablePageHooks = () => {
  const [searchParams] = useSearchParams();
  const { page } = Object.fromEntries([...Array.from(searchParams)]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  return { page, navigate, dispatch, location };
};
