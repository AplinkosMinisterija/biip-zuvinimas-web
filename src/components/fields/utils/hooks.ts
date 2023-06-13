import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { intersectionObserverConfig } from "../../../utils/configs";
import { getFilteredOptions } from "./functions";

export const useAsyncSelectData = ({
  setSuggestionsFromApi,
  disabled,
  onChange,
  dependantId,
  name,
  optionsKey
}: any) => {
  const [input, setInput] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  const observerRef = useRef(null);

  const fetchData = async (page: number) => {
    const data = await setSuggestionsFromApi(input, page, dependantId);

    if (data?.[optionsKey]) {
      return {
        data: data?.[optionsKey],
        page: data.page < data.totalPages ? data.page + 1 : undefined
      };
    }

    return {
      data,
      page: undefined
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery([name, input], ({ pageParam }) => fetchData(pageParam), {
      getNextPageParam: (lastPage) => lastPage.page,
      enabled: !isEmpty(input),
      cacheTime: 60000
    });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
      setInput("");
    }
  };

  const handleClick = (option: any) => {
    setShowSelect(false);
    setInput("");
    onChange(option);
  };

  const handleToggleSelect = () => {
    !disabled && !isEmpty(input) && setShowSelect(!showSelect);
  };

  const handleInputChange = (input: string) => {
    setShowSelect(!isEmpty(input));
    setInput(input);
  };

  const suggestions = data
    ? data.pages
        .flat()
        .map((item) => item?.data)
        .flat()
    : [];

  return {
    loading: isFetching,
    suggestions,
    input,
    handleInputChange,
    handleToggleSelect,
    showSelect,
    handleBlur,
    observerRef,
    handleClick
  };
};

export const useSelectData = ({
  options,
  disabled,
  onChange,
  getOptionLabel,
  refreshOptions,
  dependantId,
  value
}: any) => {
  const [input, setInputValue] = useState<any>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [suggestions, setSuggestions] = useState(options);
  const [loading, setLoading] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
      setInputValue("");
    }
  };

  const handleSetOptions = async () => {
    if (!refreshOptions) return;
    setLoading(true);
    await refreshOptions(dependantId);
    setLoading(false);
  };

  useEffect(() => {
    if (!showSelect || !isEmpty(options)) return;
    handleSetOptions();
  }, [showSelect]);

  useEffect(() => {
    if (typeof dependantId === "undefined") return;
    handleSetOptions();
  }, [dependantId]);

  useEffect(() => {
    const canClearValue =
      !disabled &&
      dependantId &&
      !options?.some((option: any) => option?.id === value?.id);

    if (canClearValue) {
      onChange(null);
    }

    setSuggestions(options);
  }, [options]);

  const handleClick = (option: any) => {
    setShowSelect(false);
    setInputValue("");
    onChange(option);
  };

  const handleOnChange = (input: string) => {
    if (!options) return;

    setShowSelect(!!input);
    setInputValue(input);
    setSuggestions(getFilteredOptions(options, input, getOptionLabel));
  };

  const handleToggleSelect = () => {
    !disabled && setShowSelect(!showSelect);
  };

  return {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange,
    loading
  };
};
