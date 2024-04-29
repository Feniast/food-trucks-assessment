import { API_BASEURL } from "~/config";
import { createApiClient } from "./api-client";
import { FoodTruck } from "~/typings/models";

export const client = createApiClient({ baseURL: API_BASEURL });

export const listFoodTrucksApi = client.get<undefined, FoodTruck[]>("/foodtrucks");
