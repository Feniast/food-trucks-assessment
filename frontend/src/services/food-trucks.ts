import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { listFoodTrucksApi } from "~/api";
import { FOOD_TRUCKS } from "~/api/query-keys";
import { FoodTruck } from "~/typings/models";

export const useFoodTrucks = (
  options?: Partial<UseQueryOptions<FoodTruck[]>>
) => {
  return useQuery({
    queryKey: [FOOD_TRUCKS],
    queryFn: () => listFoodTrucksApi(),
    ...options,
  });
};
