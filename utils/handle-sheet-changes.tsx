import { useCallback } from "react";

export const useHandleSheetChanges = () => {
  return useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
};
