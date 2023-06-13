import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { handleResponse } from "../../../utils/functions";
import { getFilteredOptions } from "./functions";

export const useAsyncSelectData = ({
  setSuggestionsFromApi,
  disabled,
  onChange,
  dependantId,
  optionsKey,
  hasOptionKey
}: any) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [hasMore, setHasMore] = useState(false);
  const [input, setInput] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
      setInput("");
    }
  };

  const handleClick = (option: any) => {
    setShowSelect(false);
    setInput("");
    setSuggestions([]);
    setCurrentPage(1);
    onChange(option);
  };

  useEffect(() => {
    if (isEmpty(suggestions) && showSelect) {
      handleLoadData("", 1);
    }
  }, [showSelect]);

  useEffect(() => {
    if (!dependantId) return;

    handleLoadData("", 1);
  }, [dependantId]);

  const handleLoadData = async (
    input: string,
    page: number,
    lazyLoading = false
  ) => {
    if (input.length < 2) return setSuggestions([]);

    setLoading(true);
    handleResponse({
      endpoint: () => setSuggestionsFromApi(input, page, dependantId),
      onSuccess: (response: any) => {
        setCurrentPage(response.page);
        const data = hasOptionKey ? response?.[optionsKey] : response;

        setSuggestions(lazyLoading ? [...suggestions, data] : data);
        setHasMore(response?.page < response?.totalPages);
        setLoading(false);
      }
    });
  };

  const handleScroll = async (e: any) => {
    const element = e.currentTarget;
    const isTheBottom =
      Math.abs(
        element.scrollHeight - element.clientHeight - element.scrollTop
      ) < 1;

    if (isTheBottom && hasMore && !loading) {
      handleLoadData(input, currentPage + 1, true);
    }
  };

  const handleToggleSelect = () => {
    !disabled && input.length > 2 && setShowSelect(!showSelect);
  };

  const handleInputChange = (input: string) => {
    if (input.length > 2) {
      setShowSelect(true);
      handleLoadData(input, 1);
    } else {
      setShowSelect(false);
      setSuggestions([]);
    }
    setInput(input);
  };

  return {
    loading,
    suggestions,
    handleScroll,
    input,
    handleInputChange,
    handleToggleSelect,
    showSelect,
    handleBlur,
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

    if (input) {
      setShowSelect(true);
    }
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
